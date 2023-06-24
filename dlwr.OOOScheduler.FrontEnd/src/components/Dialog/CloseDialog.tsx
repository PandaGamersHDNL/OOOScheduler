import { Dialog, DialogFooter, DialogType, PrimaryButton } from "@fluentui/react";
import { useCallback } from "react";

const dialogContentProps = {
    type: DialogType.normal,
    title: 'Are you sure you want to close the panel?',
};
const dialogModalProps = {
    isBlocking: true,
    styles: { main: { maxWidth: 450 } },
};

export function CloseDialog(props: { setIsDialogVisible: (state: boolean) => void, setOpen: (state: boolean) => void }) {
    const hideDialog = useCallback(() => props.setIsDialogVisible(false), []);
    const hideDialogAndPanel = useCallback(() => {
        props.setOpen(false);
        props.setIsDialogVisible(false);
    }, []);
    return (
        <Dialog
            hidden={false}
            //onDismiss={hideDialog}
            dialogContentProps={dialogContentProps}
            modalProps={dialogModalProps}
        >
            <DialogFooter>
                <PrimaryButton className='ButtonStyle' onClick={hideDialogAndPanel} text="Yes" />
                <PrimaryButton className='ButtonStyle' onClick={hideDialog} text="No" />
            </DialogFooter>
        </Dialog>
    )
}