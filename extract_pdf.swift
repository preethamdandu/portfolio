import Foundation
import PDFKit

let arguments = CommandLine.arguments
if arguments.count < 2 {
    print("Usage: extract_pdf <path_to_pdf>")
    exit(1)
}

let path = arguments[1]
let url = URL(fileURLWithPath: path)

if let pdf = PDFDocument(url: url) {
    if let text = pdf.string {
        print(text)
    } else {
        print("(no extractable text)")
    }
} else {
    print("Could not open PDF")
}
