import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export function PostCardSkeleton() {
  return (
    <Card className="h-full flex flex-col overflow-hidden border-slate-200/60 dark:border-slate-800/60 bg-card/50 backdrop-blur-sm">
      <Skeleton className="h-48 w-full" />
      <CardHeader className="space-y-4 pt-6">
        <div className="flex items-center gap-3">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-20" />
        </div>
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-2/3" />
      </CardHeader>
      <CardContent className="flex-grow space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
      </CardContent>
    </Card>
  )
}
