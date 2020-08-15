import * as vscode from 'vscode';
import { LocalStorageService } from './LocalStorageService';
import { formatDuration } from './utils';

// TODO: Icon in notification text?
// TODO: Add option to set real desktop notification

export function activate(context: vscode.ExtensionContext) {
  let durationObj: Duration = {} as Duration;
  const storageManager = new LocalStorageService(context.workspaceState);

  const showProgressBar = (name: string, durationObj: Duration) => {
    const msg = `Task\n"${name}"\nwill take ${formatDuration(
      durationObj.calcNextDuration
    )} ⌛`;
    vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title: msg,
        cancellable: true,
      },
      (progress, token) => {
        const stepSize = Math.trunc(durationObj.calcNextDuration / 10);

        // TODO: Fix last step too long
        Array(10)
          .fill(0)
          .forEach((e, i) => {
            setTimeout(() => {
              progress.report({ increment: 10 * (i + 1), message: msg });
            }, stepSize * (i + 1));
          });

        return new Promise((resolve) => {
          setTimeout(() => {
            resolve();
          }, durationObj.calcNextDuration);
        });
      }
    );
  };

  const taskStarted = vscode.tasks.onDidStartTask((e) => {
    durationObj.startTime = new Date();
    storageManager.setValue<any>(`taskDuration-${e.execution.task.name}`, durationObj);

    if (durationObj.calcNextDuration) {
      showProgressBar(e.execution.task.name, durationObj);
    } else {
      vscode.window.showInformationMessage(
        `Task\n"${e.execution.task.name}"\nis started 🏃🏻‍♂️`
      );
    }
  });

  const taskEnden = vscode.tasks.onDidEndTask((e) => {
    durationObj = storageManager.getValue<any>(`taskDuration-${e.execution.task.name}`);

    durationObj.endTime = new Date();
    durationObj.currentDuration =
      durationObj.endTime.valueOf() - durationObj.startTime.valueOf();

    if (!durationObj.lastDuration) {
      durationObj.lastDuration = durationObj.currentDuration;
    }

    durationObj.lastDuration =
      (durationObj.currentDuration + durationObj.lastDuration) / 2;
    durationObj.calcNextDuration = durationObj.lastDuration;

    storageManager.setValue<any>(`taskDuration-${e.execution.task.name}`, durationObj);
    vscode.window.showInformationMessage(`Task\n"${e.execution.task.name}"\nis done ✔️`);
  });

  context.subscriptions.push(taskStarted, taskEnden);
}

export function deactivate() {}
