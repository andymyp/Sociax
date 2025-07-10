import { Button } from "@/components/atoms/button";
import { Card, CardContent } from "@/components/molecules/card";

export function Promote() {
  return (
    <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 shadow-md shadow-violet-500/5 py-0 backdrop-blur-sm">
      <CardContent className="p-4">
        <h4 className="font-semibold text-sm text-card-foreground mb-2">
          Discover new trends
        </h4>
        <p className="text-sm text-muted-foreground mb-3">
          Stay updated with the latest trending topics and join the
          conversation.
        </p>
        <Button
          size="sm"
          variant="outline"
          className="border-primary/30 text-primary hover:bg-primary/10 bg-card/50"
        >
          Explore Now
        </Button>
      </CardContent>
    </Card>
  );
}
