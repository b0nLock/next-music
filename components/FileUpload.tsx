import { useRef, PropsWithChildren } from "react";

interface FileUploadProps extends PropsWithChildren {
  setFile: (file: File | null) => void;
  accept: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  setFile,
  accept,
  children,
}) => {
  const ref = useRef<HTMLInputElement>(null);
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    setFile(uploadedFile || null);
  };
  return (
    <div onClick={() => ref.current?.click()}>
      <input
        ref={ref}
        type="file"
        accept={accept}
        style={{ display: "none" }}
        onChange={onChange}
      />
      {children}
    </div>
  );
};

export default FileUpload;
