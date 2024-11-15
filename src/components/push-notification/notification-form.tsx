import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

interface NotificationFormProps {
  notification: {
    title: string;
    description: string;
  };
  setNotification: (notification: {
    title: string;
    description: string;
  }) => void;
}

export function NotificationForm({
  notification,
  setNotification,
}: NotificationFormProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="title" className="text-sm font-medium">
          Notification Title
        </label>
        <Input
          id="title"
          placeholder="Enter notification title"
          value={notification.title}
          onChange={(e) =>
            setNotification({ ...notification, title: e.target.value })
          }
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="description" className="text-sm font-medium">
          Notification Message
        </label>
        <Textarea
          id="description"
          placeholder="Enter notification message"
          value={notification.description}
          onChange={(e) =>
            setNotification({ ...notification, description: e.target.value })
          }
          rows={4}
        />
      </div>
    </div>
  );
}
