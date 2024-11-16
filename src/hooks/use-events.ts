import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createEvent, getEvents } from "@/lib/api/events";
import { useEffect, useState } from "react";
import { type AnEvent } from "@/lib/types";
import { debounce } from "@/lib/utils";

export const useEvents = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  useEffect(() => {
    const debounced = debounce(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);

    debounced();

    return () => {
      debounced.cancel();
    };
  }, [searchQuery]);
  const queryClient = useQueryClient();

  const { data: eventsData } = useQuery({
    queryKey: ["events", { page, searchQuery: debouncedSearchQuery }],
    queryFn: () => getEvents(page, debouncedSearchQuery),
    refetchOnWindowFocus: true,
    select(data) {
      return data.data;
    },
  });

  const { mutate: mutateTocreateEvent } = useMutation({
    mutationFn: async (formValues: Partial<AnEvent>) => {
      console.log(formValues);
      try {
        return await createEvent({
          ...formValues,
          createdBy: "root",
        } as AnEvent);
      } catch (error) {
        console.error("Error updating event:", error);
        throw new Error("Failed to update event");
      }
    },
    onSuccess: async (newEventData) => {
      await queryClient.cancelQueries({ queryKey: ["events"] });

      const previousEvents = queryClient.getQueryData(["events"]);

      console.log(newEventData);

      console.log(previousEvents);

      queryClient.setQueriesData(
        {
          queryKey: ["events"],
          exact: false,
        },
        {
          events: [
            // Change 'eventsData' to 'events'
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-expect-error
            ...(previousEvents.events ?? []),
            newEventData,
          ],
        }
      );

      return { previousEvents };
    },
  });

  return {
    eventsData,
    dialogOpen,
    setDialogOpen,
    mutateTocreateEvent,
    searchQuery,
    setSearchQuery,
    page,
    setPage,
  };
};
