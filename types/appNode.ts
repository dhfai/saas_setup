import { Node } from '@xyflow/react';
import { TaskParam, TaskType } from './Task';

export interface AppNodeData {
    type: TaskType;
    inputs: Record<string, String>;
    [key: string]: any;
}


export interface AppNode extends Node {
    data: AppNodeData;
}

export interface ParamProps {
    param: TaskParam;
    value: string;
    updateNodeParamValue: (newValue: string) => void;
}
