import React, { useState, useEffect } from "react";
import pdfFile from "../utils/College_fees_last_year.pdf";
import { invoke } from '@tauri-apps/api/tauri';

const TempPrint: React.FC = () => {
    const [printers, setPrinters] = useState<string[]>([]);
    const [selectedPrinter, setSelectedPrinter] = useState<string | null>(null);

    useEffect(() => {
        const fetchPrinters = async () => {
            try {
                const availablePrinters = await invoke<string[]>('get_printers');
                if (availablePrinters.length === 0) {
                    alert('No printers available');
                } else {
                    setPrinters(availablePrinters);
                    setSelectedPrinter(availablePrinters[0]); // Select the first printer by default
                }
            } catch (error) {
                console.error("Error fetching printers:", error);
                alert('Failed to retrieve printers.');
            }
        };

        fetchPrinters();
    }, []);

    const handlePrint = async (): Promise<void> => {
        if (!selectedPrinter) {
            alert('Please select a printer.');
            return;
        }

        const numberOfCopies: number = 2;
        const colorPreference: string = 'grayscale';
        const startPage: number = 1;
        const endPage: number = 1;

        try {
            const fileResponse = await fetch(pdfFile);
            const fileBlob = await fileResponse.blob();
            const fileReader = new FileReader();

            fileReader.onloadend = async () => {
                const fileData = fileReader.result?.toString().split(',')[1];
                if (fileData) {
                    await invoke('print_file', {
                        printer: selectedPrinter,
                        fileData,
                        copies: numberOfCopies,
                        startPage,
                        endPage,
                        colorPreference
                    });
                    alert('Print job sent!');
                } else {
                    alert('Failed to process the file');
                }
            };
            fileReader.readAsDataURL(fileBlob);
        } catch (error) {
            console.error("Error during printing process:", error);
            alert('An error occurred during the printing process.');
        }
    };

    return (
        <div className="h-screen flex flex-col items-center justify-center">
            {printers.length > 0 ? (
                <>
                    <select
                        value={selectedPrinter || ""}
                        onChange={(e) => setSelectedPrinter(e.target.value)}
                        className="mb-4 p-2 border border-gray-300 rounded"
                    >
                        {printers.map((printer, index) => (
                            <option key={index} value={printer}>
                                {printer}
                            </option>
                        ))}
                    </select>
                    <button
                        onClick={handlePrint}
                        className="p-4 px-10 bg-blue-600 text-white"
                    >
                        Print
                    </button>
                </>
            ) : (
                <p>No printers available</p>
            )}
        </div>
    );
};

export default TempPrint;
