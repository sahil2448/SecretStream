import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function CardBanner() {
  return (
    <Card className="w-full text-center shadow-none dark py-4">
      <CardHeader>
        <CardTitle className="mb-2 text-3xl font-bold">
          Power up your scheduling
        </CardTitle>
        <CardDescription className="text-base text-muted-foreground">
          Get started with the world&apos;s leading Scheduling Automation
          Platform in seconds – for free.
        </CardDescription>
      </CardHeader>
      <CardContent className="mt-2 flex flex-row gap-2 justify-center">
        <Button>Sign up for free</Button>
        <Button variant="secondary">Get a demo</Button>
      </CardContent>
    </Card>
  );
}
