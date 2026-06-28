import PDFDocument from 'pdfkit';
import { prisma } from '../../lib/prisma.js';
import { format } from 'date-fns';

export class ReportService {
  async generatePatientReport(userId: string): Promise<Buffer> {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error('Usuário não encontrado');

    const glucoseRecords = await prisma.glucoseRecord.findMany({
      where: { userId },
      orderBy: { measurementDateTime: 'desc' },
      take: 50
    });

    return new Promise((resolve, reject) => {
      // Cria o documento PDF (tamanho A4)
      const doc = new PDFDocument({ margin: 50, size: 'A4' });
      const chunks: Buffer[] = [];

      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      // Conteúdo do PDF
      doc.fontSize(20).text('Relatório Clínico - Glicemy', { align: 'center' });
      doc.moveDown();
      doc.fontSize(12).text(`Paciente: ${user.name}`);
      doc.text(`Data de Emissão: ${format(new Date(), 'dd/MM/yyyy HH:mm')}`);
      doc.moveDown(2);

      doc.fontSize(14).text('Últimas Medições de Glicemia', { underline: true });
      doc.moveDown();

      if (glucoseRecords.length === 0) {
        doc.text('Nenhum registro encontrado.');
      } else {
        // Cabeçalhos da Tabela
        doc.fontSize(10).font('Helvetica-Bold');
        doc.text('Data/Hora               Valor (mg/dL)      Tipo                Notas', { underline: true });
        doc.font('Helvetica');
        doc.moveDown(0.5);

        // Dados
        glucoseRecords.forEach(record => {
          const dateStr = format(record.measurementDateTime, 'dd/MM HH:mm');
          const valueStr = record.glucoseValue.toString().padEnd(20);
          const typeStr = record.measurementType.padEnd(20);
          const noteStr = record.notes || '-';
          
          doc.text(`${dateStr}     ${valueStr}   ${typeStr}   ${noteStr}`);
        });
      }

      doc.end();
    });
  }

  async sendReportByEmail(userId: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error('Usuário não encontrado');

    const pdfBuffer = await this.generatePatientReport(userId);
    const { transporter } = await import('../../lib/mailer.js');

    await transporter.sendMail({
      from: process.env.EMAIL_USER ? `"Equipe Glicemy" <${process.env.EMAIL_USER}>` : '"Equipe Glicemy" <suporte@glicemy.com>',
      to: user.email,
      subject: 'Seu Relatório Clínico - Glicemy',
      text: `Olá ${user.name}, segue em anexo o seu relatório clínico.`,
      html: `<p>Olá <b>${user.name}</b>,</p><p>Segue em anexo o seu relatório clínico de glicemia.</p>`,
      attachments: [
        {
          filename: `relatorio-glicemy-${format(new Date(), 'dd-MM-yyyy')}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf'
        }
      ]
    });

    return { message: `Relatório enviado com sucesso para ${user.email}` };
  }
}