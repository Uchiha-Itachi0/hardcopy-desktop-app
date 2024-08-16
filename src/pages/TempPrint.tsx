import React, { useState, useEffect } from "react";
import { printers as tPrinters, print_file } from "tauri-plugin-printer";
import { readBinaryFile } from '@tauri-apps/api/fs';
import { Buffer } from 'buffer';  // Import Buffer from Node.js

const TempPrint: React.FC = () => {
    const [printers, setPrinters] = useState<{ id: string; name: string }[]>([]);
    const [selectedPrinterId, setSelectedPrinterId] = useState<string>("");

    useEffect(() => {
        fetchPrinters();
    }, []);

    const fetchPrinters = async () => {
        try {
            const availablePrinters: any = await tPrinters();
            // Map the printers to an array of objects with id and name
            const printerList = availablePrinters.map((printer: any) => ({
                id: printer.id,
                name: printer.name,
            }));
            setPrinters(printerList);
            if (printerList.length > 0) {
                setSelectedPrinterId(printerList[0].id);
            }
            console.log(printerList);
        } catch (error) {
            console.error("Error fetching printers:", error);
            alert("Failed to fetch printers. Please check your connection.");
        }
    };

    const handlePrint = async (): Promise<void> => {
        if (!selectedPrinterId) {
            alert("Please select a printer.");
            return;
        }

        try {

            console.log(selectedPrinterId)
            const filePath = 'C:\\Users\\Anubhav Shukla\\Desktop\\HardCopy\\hardcopy_desktop_app\\src\\utils\\College_fees_last_year.pdf';
            const fileData = await readBinaryFile(filePath);  // Read file as Uint8Array
            const bufferData = Buffer.from(fileData);  // Convert Uint8Array to Buffer

            await print_file({
                id: selectedPrinterId,
                path: filePath,
                file: bufferData,  // Passing the Buffer data
                print_setting: {
                    orientation: "landscape",
                    method: "simplex", // duplex | simplex | duplexshort
                    paper: "A4", // "A2" | "A3" | "A4" | "A5" | "A6" | "letter" | "legal" | "tabloid"
                    scale: "noscale", //"noscale" | "shrink" | "fit"
                    repeat: 2, // total copies
                    range: {        // print page 1 - 3
                        from: 1,
                        to: 1
                    }
                }
            });
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
                    value={selectedPrinterId}
                    onChange={(e) => setSelectedPrinterId(e.target.value)}
                    className="p-2 border border-gray-300 rounded"
                >
                    {printers.map((printer) => (
                        <option key={printer.id} value={printer.id}>
                            {printer.name}
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
