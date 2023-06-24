import { Dialog, DialogFooter, DialogType, IDialogContentProps, PrimaryButton } from "@fluentui/react";

export function DeleteMessageDialog(props: { delFunc: () => void, events: string, isDefault: boolean, setIsDialogVisible: (state: boolean) => void }) {
    const hideDialogYes = () => {
        props.setIsDialogVisible(false);
        props.delFunc();
    }
    const hideDialogNo = () => { props.setIsDialogVisible(false) }
    const dialogContentProps = {
        type: DialogType.normal,
        title: 'Are you sure you want to delete this Message?',
        subText: `By deleting this message your current events: ${props.events} will use the initial set message. ${props.isDefault ? "This is your default message. Don't forget to set a new one." : ""}`

    } as IDialogContentProps;
    const dialogModalProps = {
        isBlocking: true,
        styles: { main: { maxWidth: 450 } },
    };
    return (<Dialog
        hidden={false}
        onDismiss={() => { }}
        dialogContentProps={dialogContentProps}
        modalProps={dialogModalProps}
    >
        <DialogFooter>
            <PrimaryButton className='ButtonStyle' onClick={hideDialogYes} text="Yes" />
            <PrimaryButton className='ButtonStyle' onClick={hideDialogNo} text="No" />
        </DialogFooter>
    </Dialog>
    );
}