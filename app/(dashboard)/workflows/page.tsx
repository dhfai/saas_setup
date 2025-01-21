
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Skeleton } from '@/components/ui/skeleton'
import { waitFor } from '@/lib/helper/waitFor'
import { AlertCircle, InboxIcon, Workflow } from 'lucide-react'
import React, { Suspense } from 'react'
import CreateWorkflowsDialog from './_components/CreateWorkflowsDialog'
import WorkflowCard from './_components/WorkflowCard'
import { GetWorkflowsForUser } from '@/actions/workflow/getWorkflowsForUser'

const page = () => {
  return (
    <div className='flex-1 flex-col h-full'>
        <div className='flex justify-between'>
            <div className='flex flex-col'>
                <h1 className='text-3xl font-bold'>Workflows</h1>
                <p className='text-muted-foreground'>Manage your Workflows</p>
            </div>
            <CreateWorkflowsDialog triggerText='Create your first workflows' />
        </div>

        <div className='h-full py-6'>
            <Suspense fallback={<UserWorkflowsSkeleton />}>
                <UserWorkflows />
            </Suspense>
        </div>
    </div>
  )
}

function UserWorkflowsSkeleton() {
    return (
        <div className='space-y-2'>
            {[1,2,3,4].map((i) =>
                <Skeleton key={i} className='h-32 w-full' />
            )}
        </div>
    )
}

async function UserWorkflows() {
    const workflows = await GetWorkflowsForUser();
    if (!workflows) {
        return (
            <Alert variant={"destructive"}>
                <AlertCircle className='w-4 h-4' />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                    Somethings went wrong, Please try again later
                </AlertDescription>
            </Alert>
        )
    }

    if (workflows.length === 0) {
        return (
            <div className='flex flex-col gap-4 items-center justify-center'>
                <div className='rounded-full bg-accent w-20 h-20 flex items-center justify-center'>
                    <InboxIcon size={20} className='stroke-primary' />
                </div>
                <div className='flex flex-col gap-1 text-center'>
                    <p className='font-bold'>No workflows created yet</p>
                    <p className='text-sm text-muted-foreground'>
                        Click the button below to create your first workflows
                    </p>
                </div>
                <CreateWorkflowsDialog triggerText='Create your first workflows' />
            </div>
        )
    }
    return (
        <div className="grid grid-cols-1 gap-4">
            {
                workflows.map((workflow) => (
                    <WorkflowCard key={workflow.id} workflow={workflow} />
                ))
            }
        </div>
    )
    
}


export default page