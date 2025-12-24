import { SocketClientType } from "#front/utils/socket.types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from "#front/components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import { useEffect, useState } from "react";
import { GameData } from "./+data";
import { useData } from "vike-react/useData";
import { GameisFinishedButton } from "./gameLayout";
import { Button } from "#front/components/ui/button";
import { Menu } from "lucide-react";
import { navigate } from "vike/client/router";
import { cn } from "#front/lib/utils.ts";
import { useBoardSize } from "#front/hooks/use-BoardSize.ts";
import { useIsMobile } from "#front/hooks/use-mobile.ts";
import { useTimersContext } from "#front/hooks/use-context.ts";
export const DialogEndGame = ({
  children,
  socket,
}: {
  children: React.ReactNode;
  socket: SocketClientType;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { game } = useData<GameData>();
  const { width } = useBoardSize();
  const isMobile = useIsMobile();
  const { endGame} = useTimersContext();

  useEffect(() => {
    function sendChessGameId() {
      setIsOpen(false);
    }

    if (game.status != "active") {
      console.log("modale")
      setIsOpen(true);
    }

    socket.on("sendChessGameId", sendChessGameId);
    return () => {
      socket.off("sendChessGameId", sendChessGameId);
    };
  }, [game.status, endGame, socket]);

  console.log("render dialog");
  return (
    <Dialog open={isOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        className={cn(
          "text-foreground",
          width > 1400
            ? "w-100"
            : width > 1280
            ? "w-87.5"
            : width > 1180
            ? "w-75"
            : isMobile
            ? `w-3/4`
            : "w-62.5",
          isMobile ? "left-[50%] top-[45%]" : ""
        )}
        onClose={setIsOpen}
      >
        <DialogHeader>
          <DialogTitle className="capitalize font-bold text-3xl">
            {game.winner} Won
          </DialogTitle>
          <DialogDescription className="medium text-xl">
            by {game.status}
          </DialogDescription>
        </DialogHeader>
        <Button
          className="h-12 text-xl"
          variant="secondary"
          onClick={(e) => {
            e.preventDefault();
            throw navigate("/game");
          }}
        >
          <Menu size={32} />
          Game Menu
        </Button>
        <GameisFinishedButton
          socket={socket}
          ButtonStyle={cn(
            "h-12 m-auto",
            width > 1180 || isMobile ? "w-[45%] text-md" : "w-22 text-sm"
          )}
          ContainerStyle="flex w-full"
          iconSize={width > 1180 ? 36 : 24}
          setIsOpen={setIsOpen}
        />
      </DialogContent>
    </Dialog>
  );
};
