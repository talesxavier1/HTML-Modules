

export class GlobalAlert {
    static showAlert(message: string, type: "success" | "error") {
        DevExpress.ui.notify({
            message: message,
            height: 45,
            width: 550,
            minWidth: 150,
            type: type,
            displayTime: 1000,

        }, {
            position: "top right",
            direction: "down-push"
        });
    }
}