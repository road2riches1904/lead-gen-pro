// Automated task scheduler for lead generation platform
import { AutomationEngine } from './automation';

export interface ScheduledTask {
  id: string;
  name: string;
  frequency: 'hourly' | 'daily' | 'weekly' | 'monthly';
  lastRun?: Date;
  nextRun: Date;
  enabled: boolean;
  task: () => Promise<void>;
}

export class TaskScheduler {
  private tasks: Map<string, ScheduledTask> = new Map();
  private automationEngine: AutomationEngine;
  private intervalId?: NodeJS.Timeout;

  constructor() {
    this.automationEngine = new AutomationEngine();
    this.setupDefaultTasks();
  }

  private setupDefaultTasks() {
    // Lead generation every 4 hours
    this.addTask({
      id: 'lead-generation',
      name: 'Automated Lead Generation',
      frequency: 'hourly',
      nextRun: new Date(Date.now() + 4 * 60 * 60 * 1000), // 4 hours from now
      enabled: true,
      task: async () => {
        console.log('Running automated lead generation...');
        await this.automationEngine.startLeadGeneration();
      }
    });

    // Client outreach every 2 hours during business hours
    this.addTask({
      id: 'client-outreach',
      name: 'Client Outreach Campaigns',
      frequency: 'hourly',
      nextRun: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
      enabled: true,
      task: async () => {
        const hour = new Date().getHours();
        // Only run during business hours (9 AM - 6 PM)
        if (hour >= 9 && hour <= 18) {
          console.log('Running client outreach campaigns...');
          // Implement outreach logic here
        }
      }
    });

    // Payment processing daily
    this.addTask({
      id: 'payment-processing',
      name: 'Payment Processing',
      frequency: 'daily',
      nextRun: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
      enabled: true,
      task: async () => {
        console.log('Processing payments...');
        await this.automationEngine.startPaymentProcessing();
      }
    });

    // Analytics and reporting weekly
    this.addTask({
      id: 'weekly-reporting',
      name: 'Weekly Analytics Report',
      frequency: 'weekly',
      nextRun: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      enabled: true,
      task: async () => {
        console.log('Generating weekly report...');
        await this.automationEngine.startReporting();
      }
    });
  }

  addTask(task: ScheduledTask) {
    this.tasks.set(task.id, task);
  }

  removeTask(taskId: string) {
    this.tasks.delete(taskId);
  }

  start() {
    console.log('Starting task scheduler...');
    this.intervalId = setInterval(() => {
      this.checkAndRunTasks();
    }, 60000); // Check every minute
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
    console.log('Task scheduler stopped.');
  }

  private async checkAndRunTasks() {
    const now = new Date();
    
    for (const [id, task] of this.tasks) {
      if (task.enabled && now >= task.nextRun) {
        try {
          console.log(`Running task: ${task.name}`);
          await task.task();
          
          // Update last run and calculate next run
          task.lastRun = now;
          task.nextRun = this.calculateNextRun(task.frequency, now);
          
          console.log(`Task completed: ${task.name}, next run: ${task.nextRun}`);
        } catch (error) {
          console.error(`Error running task ${task.name}:`, error);
        }
      }
    }
  }

  private calculateNextRun(frequency: ScheduledTask['frequency'], from: Date): Date {
    const next = new Date(from);
    
    switch (frequency) {
      case 'hourly':
        next.setHours(next.getHours() + 1);
        break;
      case 'daily':
        next.setDate(next.getDate() + 1);
        break;
      case 'weekly':
        next.setDate(next.getDate() + 7);
        break;
      case 'monthly':
        next.setMonth(next.getMonth() + 1);
        break;
    }
    
    return next;
  }

  getTaskStatus() {
    return Array.from(this.tasks.values()).map(task => ({
      id: task.id,
      name: task.name,
      frequency: task.frequency,
      lastRun: task.lastRun,
      nextRun: task.nextRun,
      enabled: task.enabled
    }));
  }

  enableTask(taskId: string) {
    const task = this.tasks.get(taskId);
    if (task) {
      task.enabled = true;
    }
  }

  disableTask(taskId: string) {
    const task = this.tasks.get(taskId);
    if (task) {
      task.enabled = false;
    }
  }
}

// Export singleton instance
export const scheduler = new TaskScheduler();