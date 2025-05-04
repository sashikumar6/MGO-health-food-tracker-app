"use client"

import { useState } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bell, Goal, Utensils, Award, Calendar, X } from "lucide-react"
import { cn } from "@/lib/utils"

export function NotificationsDropdown() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Goal Achieved!",
      message: "You've reached your protein goal for today. Great job!",
      time: "Just now",
      type: "achievement",
      read: false,
    },
    {
      id: 2,
      title: "Meal Reminder",
      message: "Don't forget to log your lunch today.",
      time: "2 hours ago",
      type: "reminder",
      read: false,
    },
    {
      id: 3,
      title: "New Restaurant Added",
      message: "Sweetgreen has added new seasonal items to their menu.",
      time: "Yesterday",
      type: "update",
      read: true,
    },
    {
      id: 4,
      title: "Weekly Summary",
      message: "Your nutrition report for last week is now available.",
      time: "3 days ago",
      type: "report",
      read: true,
    },
    {
      id: 5,
      title: "Hydration Alert",
      message: "You're 2 cups behind on your water goal today.",
      time: "5 hours ago",
      type: "alert",
      read: false,
    },
  ])

  const [hasUnread, setHasUnread] = useState(true)

  // Mark all notifications as read
  const markAllAsRead = (e) => {
    e.stopPropagation()
    setNotifications(notifications.map((notification) => ({ ...notification, read: true })))
    setHasUnread(false)
  }

  // Mark a single notification as read
  const markAsRead = (id, e) => {
    e.stopPropagation()
    setNotifications(
      notifications.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )

    // Check if there are any unread notifications left
    const anyUnread = notifications.some((notification) => notification.id !== id && !notification.read)
    setHasUnread(!anyUnread)
  }

  // Get icon based on notification type
  const getNotificationIcon = (type) => {
    switch (type) {
      case "achievement":
        return <Award className="h-4 w-4 text-emerald-500" />
      case "reminder":
        return <Calendar className="h-4 w-4 text-blue-500" />
      case "update":
        return <Utensils className="h-4 w-4 text-purple-500" />
      case "report":
        return <Goal className="h-4 w-4 text-amber-500" />
      case "alert":
        return <Bell className="h-4 w-4 text-red-500" />
      default:
        return <Bell className="h-4 w-4 text-muted-foreground" />
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {hasUnread && <span className="absolute top-1 right-1 w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between p-4">
          <DropdownMenuLabel className="font-semibold text-lg">Notifications</DropdownMenuLabel>
          <Button variant="ghost" size="sm" onClick={markAllAsRead} disabled={!hasUnread}>
            Mark all as read
          </Button>
        </div>
        <DropdownMenuSeparator />
        <ScrollArea className="h-[300px]">
          {notifications.length > 0 ? (
            <div>
              {notifications.map((notification) => (
                <DropdownMenuItem
                  key={notification.id}
                  className={cn("flex items-start gap-3 p-4 cursor-default", !notification.read && "bg-muted/50")}
                >
                  <div className="rounded-full p-2 bg-muted flex-shrink-0 mt-0.5">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium text-sm">{notification.title}</h4>
                      <span className="text-xs text-muted-foreground">{notification.time}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                  </div>
                  {!notification.read && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 rounded-full flex-shrink-0"
                      onClick={(e) => markAsRead(notification.id, e)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </DropdownMenuItem>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full py-8 text-center">
              <Bell className="h-10 w-10 text-muted-foreground mb-2 opacity-20" />
              <h3 className="font-medium">No notifications</h3>
              <p className="text-sm text-muted-foreground mt-1">
                You're all caught up! We'll notify you when there's something new.
              </p>
            </div>
          )}
        </ScrollArea>
        <DropdownMenuSeparator />
        <div className="p-2">
          <Button variant="outline" className="w-full text-sm" size="sm">
            View all notifications
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
