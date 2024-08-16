import {invoke} from '@tauri-apps/api/tauri';

export async function getPrinters(): Promise<string[]> {
    try {
        return await window.__TAURI__.plugin.printer.getPrinters();
    } catch (error) {
        console.error("Failed to fetch printers:", error);
        return [];
    }
}

export async function printFile(printerName: string, filePath: string, options: any) {
    try {
        const printJob = await invoke('print_file', {
            printerName,
            filePath,
            options
        });
        return printJob;
    } catch (error) {
        console.error("Failed to print file", error);
    }
}
