"use client";

import { useState } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
  type: "expense" | "approval" | "system";
}

export function Notifications() {
  // This would come from a real notifications API in production
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "New Expense Submitted",
      description: "Jane Smith has submitted a new expense for approval",
      time: "Just now",
      read: false,
      type: "expense",
    },
    {
      id: "2",
      title: "Expense Approved",
      description: "Your expense 'Client meeting lunch' has been approved",
      time: "2 hours ago",
      read: false,
      type: "approval",
    },
    {
      id: "3",
      title: "New Team Member",
      description: "Michael Johnson has joined your organization",
      time: "Yesterday",
      read: true,
      type: "system",
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
              {unreadCount}
            </span>
          )}
          <span className="sr-only">Toggle notifications</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between border-b p-3">
          <h4 className="font-medium">Notifications</h4>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              className="h-auto p-0 text-xs text-primary underline"
              onClick={markAllAsRead}
            >
              Mark all as read
            </Button>
          )}
        </div>
        <ScrollArea className="h-[calc(80vh-8rem)] md:h-80">
          {notifications.length > 0 ? (
            <div className="flex flex-col gap-1 p-1">
              {notifications.map((notification) => (
                <button
                  key={notification.id}
                  className={cn(
                    "flex flex-col gap-1 rounded-lg p-3 text-left text-sm transition-colors hover:bg-muted",
                    !notification.read && "bg-muted/50"
                  )}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span
                      className={cn(
                        "font-medium",
                        !notification.read && "text-primary"
                      )}
                    >
                      {notification.title}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {notification.time}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {notification.description}
                  </p>
                </button>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center text-sm text-muted-foreground">
              No notifications
            </div>
          )}
        </ScrollArea>
        <div className="border-t p-2">
          <Button variant="ghost" className="w-full justify-center" asChild>
            <a href="/dashboard/notifications">View all notifications</a>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
} 