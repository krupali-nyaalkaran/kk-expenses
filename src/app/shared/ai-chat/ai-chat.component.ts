import { Component, signal, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

interface ChatMessage {
  sender: 'ai' | 'user';
  text: string;
}

@Component({
  selector: 'app-ai-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatButtonModule, MatCardModule],
  templateUrl: './ai-chat.component.html',
  styleUrls: ['./ai-chat.component.scss']
})
export class AiChatComponent implements AfterViewChecked {
  @ViewChild('scrollMe') private myScrollContainer!: ElementRef;

  isChatOpen = signal<boolean>(false);
  userInput = signal<string>('');
  
  messages = signal<ChatMessage[]>([
    { sender: 'ai', text: 'Hi! I am your AI Expense Assistant. Tell me your daily costs (e.g., "auto 50 rs, food 50") or your monthly budget ("my budget is 3000").' }
  ]);

  toggleChat() {
    this.isChatOpen.update(val => !val);
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      if (this.myScrollContainer) {
        this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
      }
    } catch(err) { }
  }

  sendMessage() {
    const text = this.userInput().trim();
    if (!text) return;

    this.messages.update(msgs => [...msgs, { sender: 'user', text }]);
    this.userInput.set('');
    
    // Simulate thinking delay
    setTimeout(() => {
      this.processAiResponse(text.toLowerCase());
    }, 600);
  }

  private processAiResponse(input: string) {
    let reply = '';
    
    // 1. Check for budget scenario
    if (input.includes('budget')) {
      const numbers = input.match(/\d+/g);
      if (numbers && numbers.length > 0) {
        const budgetAmount = parseInt(numbers[0], 10);
        const dailyLimit = Math.floor(budgetAmount / 30);
        reply = `I see your monthly budget is ₹${budgetAmount}. To stay within limit, you should spend a maximum of ₹${dailyLimit} per day.`;
      } else {
        reply = "You mentioned a budget, but I couldn't find the amount. E.g., say 'my budget is 3000'.";
      }
    } 
    // 2. Check for daily costs scenario
    else {
      const numbers = input.match(/\d+/g);
      if (numbers && numbers.length > 0) {
        const dailyTotal = numbers.reduce((sum, numStr) => sum + parseInt(numStr, 10), 0);
        const monthlyProjection = dailyTotal * 30;
        reply = `Okay, I calculated your daily costs: ₹${dailyTotal}. At this rate, your estimated monthly cost will be around ₹${monthlyProjection}.`;
      } else {
        reply = "I didn't catch any numbers. Please tell me your costs like 'auto 50, food 50'.";
      }
    }

    this.messages.update(msgs => [...msgs, { sender: 'ai', text: reply }]);
  }
}
