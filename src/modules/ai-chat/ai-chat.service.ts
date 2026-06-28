import { prisma } from '../../lib/prisma.js';
import { openai } from '../../lib/openai.js';

// Instrução oculta que dita o comportamento da IA (Atende ao RF025)
const SYSTEM_PROMPT = `Você é um assistente virtual especializado em diabetes. Sua função é ajudar pessoas com Diabetes Mellitus a entender melhor sobre a doença e hábitos de saúde. Responda com empatia, clareza e base científica, mas sem fornecer diagnósticos. Use uma linguagem acessível para o público leigo. Oriente o usuário a sempre consultar um profissional de saúde antes de tomar decisões clínicas.`;

export class AiChatService {
  async sendMessage(userId: string, content: string, conversationId?: string) {
    let conversation;
    let sequenceNumber = 1;

    // 1. Verifica ou cria a Conversa
    if (conversationId) {
      conversation = await prisma.conversation.findUnique({
        where: { id: conversationId },
        include: { messages: { orderBy: { sequenceNumber: 'asc' } } },
      });
      if (!conversation || conversation.userId !== userId) throw new Error('Conversa não encontrada');
      
      const lastMessage = conversation.messages[conversation.messages.length - 1];
      if (lastMessage) sequenceNumber = lastMessage.sequenceNumber + 1;
    } else {
      conversation = await prisma.conversation.create({
        data: { userId, title: 'Novo chat sobre Diabetes' },
        include: { messages: true },
      });
    }

    // 2. Salva a mensagem do Usuário
    const userMessage = await prisma.message.create({
      data: {
        conversationId: conversation.id,
        content,
        role: "user",
        sequenceNumber,
      },
    });

    // 3. Monta o histórico para enviar para a OpenAI
    const apiMessages: any[] = [{ role: 'system', content: SYSTEM_PROMPT }];
    
    if (conversation.messages) {
      conversation.messages.forEach((msg: any) => {
        apiMessages.push({ role: msg.role === 'assistant' ? 'assistant' : 'user', content: msg.content });
      });
    }
    apiMessages.push({ role: 'user', content }); // Adiciona a mensagem atual

    // 4. Chama a OpenAI e mede o tempo
    const startTime = Date.now();
    let aiResponseContent = '';
    let usage: any = null;
    let success = true;
    let errorMessage = null;

    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: apiMessages,
        temperature: 0.7,
      });

      aiResponseContent = completion.choices[0].message.content || 'Desculpe, não consegui gerar uma resposta.';
      usage = completion.usage;
    } catch (error: any) {
      success = false;
      errorMessage = error.message;
      aiResponseContent = 'Desculpe, ocorreu um erro de conexão com o servidor de IA. Tente novamente mais tarde.';
    }

    const responseTimeMs = Date.now() - startTime;

    // 5. Salva a resposta da IA
    sequenceNumber++;
    const assistantMessage = await prisma.message.create({
      data: {
        conversationId: conversation.id,
        content: aiResponseContent,
        role: "assistant",
        sequenceNumber,
      },
    });

    // 6. Registra a Auditoria na tabela AIInteraction
    await prisma.aIInteraction.create({
      data: {
        messageId: assistantMessage.id,
        model: 'gpt-4o-mini',
        promptTokens: usage?.prompt_tokens,
        completionTokens: usage?.completion_tokens,
        totalTokens: usage?.total_tokens,
        responseTimeMs,
        success,
        errorMessage,
      },
    });

    return {
      conversationId: conversation.id,
      userMessage,
      assistantMessage,
    };
  }

  async listConversations(userId: string) {
    return await prisma.conversation.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      select: { id: true, title: true, createdAt: true, updatedAt: true }
    });
  }

  async getConversationHistory(id: string, userId: string) {
    const conversation = await prisma.conversation.findUnique({
      where: { id },
      include: {
        messages: { orderBy: { sequenceNumber: 'asc' } },
      },
    });
    if (!conversation || conversation.userId !== userId) throw new Error('Conversa não encontrada');
    return conversation;
  }
}