import React, { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { readBinaryFile } from "@tauri-apps/api/fs";

const TempPrint: React.FC = () => {
    const [printers, setPrinters] = useState<string[]>([]);
    const [selectedPrinter, setSelectedPrinter] = useState<string>("");

    useEffect(() => {
        fetchPrinters();
    }, []);

    const fetchPrinters = async () => {
        try {
            const availablePrinters: string[] = await invoke('get_printers');
            setPrinters(availablePrinters);
            if (availablePrinters.length > 0) {
                setSelectedPrinter(availablePrinters[0]);
            }
        } catch (error) {
            console.error("Error fetching printers:", error);
            alert("Failed to fetch printers. Please check your connection.");
        }
    };

    const handlePrint = async (): Promise<void> => {
        if (!selectedPrinter) {
            alert("Please select a printer.");
            return;
        }

        try {
            const numberOfCopies: number = 2;
            const color_preference: string = 'grayscale';
            const startPage: number = 1;
            const endPage: number = 1;

            // Use a relative path
            const filePath = 'src/utils/College_fees_last_year.pdf';

            // Read the file content
            const fileContent = await readBinaryFile(filePath);

            // Convert the Uint8Array to a base64 string
            const base64Content = btoa(
                new Uint8Array(fileContent).reduce((data, byte) => data + String.fromCharCode(byte), '')
            );

            // Invoke the print command
            await invoke("print_file", {
                printer: selectedPrinter,
                fileData: base64Content,
                copies: numberOfCopies,
                startPage,
                endPage,
                colorPreference: color_preference
            });

            console.log("Print job sent successfully");
            alert("Print job sent successfully");
        } catch (error: any) {
            console.error("Error during printing process:", error);
            alert("Error during printing process: " + error.message);
        }
    };

    return (
        <div className="h-screen flex flex-col items-center justify-center space-y-4">
            {printers.length > 0 ? (
                <select
                    value={selectedPrinter}
                    onChange={(e) => setSelectedPrinter(e.target.value)}
                    className="p-2 border border-gray-300 rounded"
                >
                    {printers.map((printer, index) => (
                        <option key={index} value={printer}>
                            {printer}
                        </option>
                    ))}
                </select>
            ) : (
                <div className="text-red-500">No printers available</div>
            )}
            <button
                onClick={handlePrint}
                className="p-4 px-10 bg-blue-600 text-white rounded disabled:bg-gray-400"
                disabled={printers.length === 0}
            >
                Print
            </button>
        </div>
    );
};

export default TempPrint;