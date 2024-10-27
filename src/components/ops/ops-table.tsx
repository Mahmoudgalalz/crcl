"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReaderTable from "./reader-table";
import { BoothTable } from "./booth-table";

export function OpsTable() {
  return (
    <Card className="!border-0">
      <CardContent className="!border-0">
        <div className="flex justify-between w-full">
          <Tabs defaultValue="BOOTH" className="mb-4 w-full">
            <TabsList>
              <TabsTrigger value="BOOTH">Booth</TabsTrigger>
              <TabsTrigger value="READER">Reader</TabsTrigger>
            </TabsList>
            <TabsContent value="BOOTH">
              <BoothTable />
            </TabsContent>
            <TabsContent value="READER" className="w-full">
              <ReaderTable />
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  );
}
