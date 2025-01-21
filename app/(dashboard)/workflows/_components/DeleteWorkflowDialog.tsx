'use client'

import { DeleteWorkflow } from '@/actions/workflow/deleteWorkflow';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Input } from '@/components/ui/input';
import { useMutation } from '@tanstack/react-query';
import React, { useState } from 'react'
import { toast } from 'sonner';

interface Props {
    open: boolean;
    setOpen: (open: boolean) => void
    workflowName: string
    workflowId: string
}

const DeleteWorkflowDialog = ({open, setOpen, workflowName, workflowId}: Props) => {
    const [confirmText, setConfirmText] = useState('')

    const deleteMutation = useMutation({
        mutationFn: DeleteWorkflow,
        onSuccess: () => {
            toast.success('Workflow deleted successfully', { id: 'delete-workflow' })
            setConfirmText('')
        },
        onError: () => {
            toast.error('Failed to delete workflow', { id: 'delete-workflow' })
        }
    })
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                    If you dekete this workflow, you will bot be able to recover it.
                    <div className='flex flex-col py-4 gap-2'>
                        <p>if you sure, enter <b>{workflowName}</b> to confirm</p>
                        <Input value={confirmText} onChange={(e) => setConfirmText(e.target.value)} />
                    </div>
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogAction
                    disabled={confirmText !== workflowName || deleteMutation.isPending}
                    onClick={() => {
                        toast.loading('Deleting workflow...', { id: 'delete-workflow' })
                        deleteMutation.mutate(workflowId)
                    }} className='bg-destructive text-destructive-foreground hover:bg-destructive/80'>Delete</AlertDialogAction>
                <AlertDialogCancel onClick={() => setConfirmText("")}>Cancel</AlertDialogCancel>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
  )
}

export default DeleteWorkflowDialog