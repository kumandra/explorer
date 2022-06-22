import { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import Image from "next/image";
import AddFile from "../public/add_file.svg";
import humanSize from "human-size";
import { CopyToClipboard } from "react-copy-to-clipboard";

export default function Home() {
    const [file, setFile] = useState(null);
    const [res, setRes] = useState(null);
    const [copied, setCopied] = useState(false);
    const [loading, setLoading] = useState(false);

    function handleSelectFile(e) {
        setFile(e.target.files[0]);
    }

    function upload() {
        setLoading(true);
        const formdata = new FormData();
        formdata.append("file", file, file?.name);
        // formdata.append("file", strblob, "file.txt");
        // formdata.append("field-1", "field-1-data");

        var requestOptions = {
            method: "POST",
            body: formdata,
        };

        fetch("https://gateway.kumandra.org/api/add", requestOptions)
            .then((response) => response.text())
            .then((result) => {
                const data = result.split("\n");
                // console.log(data[0]);
                setRes(JSON.parse(data[0]));
                setLoading(false);
            })
            .catch((error) => console.log("error", error));
    }

    useEffect(() => {
        console.log(file);
    }, [file]);

    return (
        <div>
            <NavBar />
            <div className="w-full min-screen flex place-content-center">
                <div className="w-2/3 h-screen flex flex-col place-content-center place-items-center gap-10">
                    {!file && (
                        <label className="form-control w-full h-96 p-10 bg-base-200 rounded-xl flex place-content-center place-items-center cursor-pointer">
                            <label className="label text-lg font-bold" htmlFor="formFile">
                                Choose file
                            </label>
                            <label className="input-group" htmlFor="formFile">
                                <input
                                    type="file"
                                    id="formFile"
                                    placeholder="No files chosen"
                                    className="input input-bordered hidden"
                                    onChange={handleSelectFile}
                                />
                            </label>
                            <Image src={AddFile} alt="add file button" />
                        </label>
                    )}
                    {file && (
                        <div className="w-full stats bg-primary text-primary-content">
                            <div className="stat flex-grow">
                                <div className="stat-title">File name</div>
                                <div className="stat-value">{file.name}</div>
                                <div className="stat-actions">
                                    <button className="btn btn-sm btn-success">{file.type}</button>
                                </div>
                            </div>
                            <div className="stat">
                                <div className="stat-title flex place-content-end">File size</div>
                                <div className="stat-value flex place-content-end">{humanSize(file.size)}</div>
                                <div className="stat-actions  flex place-content-end">
                                    <button
                                        className={`btn btn-sm btn-success mr-2 ${loading && "loading"}`}
                                        onClick={upload}
                                    >
                                        Upload
                                    </button>
                                    <button className="btn btn-sm btn-error" onClick={() => setFile(null)}>
                                        Clear
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                    {res && (
                        <div className="w-full alert alert-info shadow-lg">
                            <div>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    className="stroke-info flex-shrink-0 w-6 h-6"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                                <div>
                                    <h3 className="font-bold">File uploaded</h3>
                                    <div className="text-xs">Your file hash: {res?.Hash}</div>
                                </div>
                            </div>
                            <div className="flex-none">
                                <a
                                    className="btn btn-sm"
                                    target="_blank"
                                    href={`https://gateway.kumandra.org/files/${res.Hash}`}
                                    rel="noreferrer"
                                >
                                    View File
                                </a>
                                <CopyToClipboard text={res.Hash} onCopy={() => setCopied(true)}>
                                    <button className="btn btn-sm">{copied ? "Copied" : "Copy Hash"}</button>
                                </CopyToClipboard>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
