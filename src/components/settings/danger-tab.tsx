import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { AlertTriangle } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogFooter } from "../ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/api/instance";

export function DangerTab() {
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useQuery({
    queryKey: ["maintenanceMode"],
    queryFn: () => axiosInstance.get("status"),
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-expect-error
    onSuccess: (data) => {
      setIsMaintenanceMode(data.data === null ? false : true);
    },
  });

  const handleMaintenanceModeToggle = () => {
    setIsDialogOpen(true);
  };

  const confirmMaintenanceMode = () => {
    axiosInstance.post("status", {
      maintenance: !isMaintenanceMode,
    });
    setIsMaintenanceMode(!isMaintenanceMode);
    setIsDialogOpen(false);
  };

  return (
    <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
      <h2 className="text-2xl font-bold text-red-700 mb-4">Danger Zone</h2>
      <div className="flex items-center justify-between p-4 bg-white border border-red-300 rounded-md">
        <div>
          <h3 className="text-lg font-semibold text-red-700">
            Maintenance Mode
          </h3>
          <p className="text-sm text-gray-600">
            Toggle this switch to put the app into maintenance mode. This will
            prevent users from accessing the app.
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <div className="relative inline-grid h-9 grid-cols-[1fr_1fr] items-center text-sm font-medium">
              <Switch
                id="switch-14"
                checked={isMaintenanceMode}
                onCheckedChange={handleMaintenanceModeToggle}
                className="peer absolute inset-0 h-[inherit] w-auto rounded-lg data-[state=unchecked]:bg-input [&_span]:z-10 [&_span]:h-full [&_span]:w-1/2 [&_span]:rounded-md [&_span]:transition-transform [&_span]:duration-300 [&_span]:[transition-timing-function:cubic-bezier(0.16,1,0.3,1)] data-[state=checked]:[&_span]:translate-x-full rtl:data-[state=checked]:[&_span]:-translate-x-full"
              />
              <span className="min-w-78flex pointer-events-none relative ms-0.5 items-center justify-center px-2 text-center transition-transform duration-300 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] peer-data-[state=checked]:invisible peer-data-[state=unchecked]:translate-x-full rtl:peer-data-[state=unchecked]:-translate-x-full">
                <span className="text-[10px] font-medium uppercase">Off</span>
              </span>
              <span className="min-w-78flex pointer-events-none relative me-0.5 items-center justify-center px-2 text-center transition-transform duration-300 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] peer-data-[state=unchecked]:invisible peer-data-[state=checked]:-translate-x-full peer-data-[state=checked]:text-background rtl:peer-data-[state=checked]:translate-x-full">
                <span className="text-[10px] font-medium uppercase">On</span>
              </span>
            </div>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                Confirm Maintenance Mode
              </DialogTitle>
              <DialogDescription>
                Are you sure you want to{" "}
                {isMaintenanceMode ? "disable" : "enable"} maintenance mode?
                This action will affect all users.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={confirmMaintenanceMode}>
                Confirm
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
