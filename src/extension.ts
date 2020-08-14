import * as vscode from 'vscode';
import { LocalStorageService } from './LocalStorageService';
import { formatDuration } from './utils';

// TODO: Icon in notification text?
// TODO: TODO: Add progress bar for expected/calculated next duration
// TODO: Add option to set real desktop notification

export function activate(context: vscode.ExtensionContext) {
  let durationObj: Duration = {} as Duration;
  const storageManager = new LocalStorageService(context.workspaceState);

  const taskStarted = vscode.tasks.onDidStartTask((e) => {
    durationObj.startTime = new Date();
    storageManager.setValue<any>(`taskDuration-${e.execution.task.name}`, durationObj);

    if (durationObj.calcNextDuration) {
      vscode.window.showInformationMessage(`Task\n"${e.execution.task.name}"\nwill take ${formatDuration(durationObj.calcNextDuration)} ⌛`);
    } else {
      vscode.window.showInformationMessage(`Task\n"${e.execution.task.name}"\nis started 🏃‍♂️`);
    }
  });

  const taskEnden = vscode.tasks.onDidEndTask((e) => {
    durationObj = storageManager.getValue<any>(`taskDuration-${e.execution.task.name}`);

    durationObj.endTime = new Date();
    durationObj.currentDuration = durationObj.endTime.valueOf() - durationObj.startTime.valueOf();

    if (!durationObj.lastDuration) durationObj.lastDuration = durationObj.currentDuration;

    durationObj.lastDuration = (durationObj.currentDuration + durationObj.lastDuration) / 2;
    durationObj.calcNextDuration = durationObj.lastDuration;

    storageManager.setValue<any>(`taskDuration-${e.execution.task.name}`, durationObj);
    vscode.window.showInformationMessage(`Task\n"${e.execution.task.name}"\nis done ✔️\n(hopefully successfully)`);
  });

  context.subscriptions.push(taskStarted, taskEnden);
}

export function deactivate() { }
