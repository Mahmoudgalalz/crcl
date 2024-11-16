"use client";
import { useState } from "react";
import { BellIcon, SendIcon, UsersIcon, Users2Icon } from "lucide-react";
import { ContentLayout } from "@/components/content-layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { UserList } from "@/components/push-notification/user-list";
import { GroupList } from "@/components/push-notification/group-list";
import { NotificationForm } from "@/components/push-notification/notification-form";
import { usePushNotifications } from "@/hooks/use-push-notifications";

export default function PushNotificationsPage() {
  const [selectedTab, setSelectedTab] = useState("multiple");
  const [notification, setNotification] = useState({
    title: "",
    description: "",
  });
  const [selectedIndividualUser, setSelectedIndividualUser] = useState<
    string[]
  >([]);
  const [selectedMultipleUsers, setSelectedMultipleUsers] = useState<string[]>(
    []
  );
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const { toast } = useToast();

  const {
    isLoading,
    isSuccess,
    pushToAllUsers,
    pushToGroup,
    pushToMultilpleUsers,
  } = usePushNotifications();

  const isReceiverSelected = () => {
    switch (selectedTab) {
      case "individual":
        return selectedIndividualUser.length > 0;
      case "multiple":
        return selectedMultipleUsers.length > 0;
      case "all":
        return true;
      case "groups":
        return selectedGroup !== null;
      default:
        return false;
    }
  };

  const handleSend = async () => {
    if (!notification.title || !notification.description) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in all fields",
      });
      return;
    }

    switch (selectedTab) {
      case "multiple":
        pushToMultilpleUsers({
          users: selectedMultipleUsers,
          title: notification.title,
          message: notification.description,
        });
        break;
      case "all":
        pushToAllUsers({
          title: notification.title,
          message: notification.description,
        });
        break;
      case "groups":
        pushToGroup({
          groupId: selectedGroup!,
          title: notification.title,
          message: notification.description,
        });
        break;
    }

    if (isSuccess) {
      setSelectedIndividualUser([]);
      setSelectedMultipleUsers([]);
      setSelectedGroup(null);
    }
  };

  return (
    <ContentLayout title="Push Notifications">
      <div className="container mx-auto min-h-max ">
        <h1 className="text-2xl font-semibold"> Push Notifications</h1>
        <div className="space-y-6 mt-4 h-full ">
          <Tabs
            value={selectedTab}
            onValueChange={setSelectedTab}
            className="h-full"
          >
            <TabsList className="grid w-full grid-cols-3 lg:w-2/5">
              <TabsTrigger value="multiple" className="flex items-center gap-2">
                <UsersIcon className="h-4 w-4" />
                Select Users
              </TabsTrigger>
              <TabsTrigger value="all" className="flex items-center gap-2">
                <Users2Icon className="h-4 w-4" />
                All Users
              </TabsTrigger>
              <TabsTrigger value="groups" className="flex items-center gap-2">
                <BellIcon className="h-4 w-4" />
                Groups
              </TabsTrigger>
            </TabsList>

            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <Card className="p-6">
                <TabsContent value="multiple" className="mt-0">
                  <h3 className="font-medium mb-4">Select Multiple Users</h3>
                  <UserList
                    mode="multiple"
                    selectedUsers={selectedMultipleUsers}
                    onSelectionChange={setSelectedMultipleUsers}
                  />
                </TabsContent>

                <TabsContent value="all" className="mt-0 h-full">
                  <div className="text-center py-6 flex flex-col items-center justify-center h-full">
                    <Users2Icon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="font-medium text-lg mb-2">
                      Send to All Users
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      This will send the notification to all registered users in
                      the system.
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="groups" className="mt-0">
                  <h3 className="font-medium mb-4">Select Group</h3>
                  <GroupList
                    selectedGroup={selectedGroup}
                    onGroupSelect={setSelectedGroup}
                  />
                </TabsContent>
              </Card>
              <Card className="p-6">
                <NotificationForm
                  notification={notification}
                  setNotification={setNotification}
                />

                <Button
                  className="w-full mt-6"
                  onClick={handleSend}
                  disabled={
                    isLoading ||
                    !notification.title ||
                    !notification.description ||
                    !isReceiverSelected()
                  }
                >
                  <SendIcon className="h-4 w-4 mr-2" />
                  {isLoading ? "Sending..." : "Send Notification"}
                </Button>
              </Card>
            </div>
          </Tabs>
        </div>
      </div>
    </ContentLayout>
  );
}
