import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { ChatbotService } from '../Service/chatbot.service';
import { Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css'],
})
export class ChatbotComponent implements OnInit {
  @ViewChild('chatBody') private chatBodyContainer!: ElementRef;

  showChat = false;
  showForm = false;
  inputText = '';
  userName = '';
  userPhone = '';
  isBrowser: boolean;

  messages: { from: 'user' | 'bot'; text: string }[] = [];
  showSuggestions = false;
  suggestionChips = [
    'iPhone 15 Pro Max',
    'Tư vấn Laptop',
    'Địa chỉ cửa hàng',
    'Liên hệ',
  ];

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private chatbotService: ChatbotService
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {

  }

  toggleChat() {
    this.showChat = !this.showChat;
    this.showForm = this.showChat;
    this.messages = [];
  }

  submitUserInfo() {
    if (!this.userName.trim() || !this.userPhone.trim()) return;

    this.showForm = false;
    this.loadChatHistory();

    if (this.messages.length === 0) {
      this.addWelcomeMessages();
    } else {
      this.showSuggestions = true;
    }
  }

  addWelcomeMessages() {
    this.messages.push({
      from: 'bot',
      text: `Xin chào Anh/Chị! Em là trợ lý AI của Tech Store.`,
    });

    setTimeout(() => {
      this.messages.push({
        from: 'bot',
        text: 'Em rất sẵn lòng hỗ trợ Anh/Chị 😊',
      });
      this.showSuggestions = true;
    }, 1000);
  }

  sendMessage() {
    const msg = this.inputText.trim();
    if (!msg) return;

    this.messages.push({ from: 'user', text: msg });
    this.inputText = '';
    this.showSuggestions = false;

    this.chatbotService
      .sendMessage(msg, this.userName, this.userPhone)
      .subscribe({
        next: (res: any) => {
          const reply =
            res.candidates?.[0]?.content?.parts?.[0]?.text ||
            'Xin lỗi, tôi chưa hiểu ý của bạn.';
          this.messages.push({
            from: 'bot',
            text: reply.replace(
              /(https?:\/\/[^\s]+)/g,
              '<a href="$1" target="_blank" style="color:#1877f2;text-decoration:none;">$1</a>'
            ),
          });
          this.showSuggestions = true;
          this.saveChatHistory();
          this.scrollToBottom();
        },
        error: () => {
          this.messages.push({
            from: 'bot',
            text: '❌ Rất tiếc, đã có lỗi xảy ra. Vui lòng thử lại sau.',
          });
          this.showSuggestions = true;
          this.scrollToBottom();
        },
      });

    this.scrollToBottom();
  }

  selectSuggestion(chip: string) {
    this.inputText = chip;
    this.sendMessage();
  }

  saveChatHistory() {
    localStorage.setItem(
      `chat_${this.userPhone}`,
      JSON.stringify(this.messages)
    );
  }

  loadChatHistory() {
    const saved = localStorage.getItem(`chat_${this.userPhone}`);
    if (saved) this.messages = JSON.parse(saved);
  }

  scrollToBottom() {
    setTimeout(() => {
      try {
        this.chatBodyContainer.nativeElement.scrollTop =
          this.chatBodyContainer.nativeElement.scrollHeight + 50;
      } catch {}
    }, 0);
  }
}
