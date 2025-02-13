import { ReactNode, useEffect, useState } from "react";
import ReactQuill, { Quill, ReactQuillProps } from "react-quill";
// @mui
import { styled } from "@mui/material/styles";
import { Box, BoxProps, Typography } from "@mui/material";
//
import EditorToolbar, {
  formats,
  redoChange,
  undoChange,
} from "./EditorToolbar";

// ----------------------------------------------------------------------

const RootStyle = styled(Box)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  border: `solid 1px rgba(145, 158, 171, 0.32)`,
  "& .ql-container.ql-snow": {
    borderColor: "transparent",
    ...theme.typography.body1,
    fontFamily: theme.typography.fontFamily,
  },
  "& .ql-editor": {
    minHeight: 200,
    maxHeight: 640,
    "&.ql-blank::before": {
      fontStyle: "normal",
      color: theme.palette.text.disabled,
    },
    "& pre.ql-syntax": {
      ...theme.typography.body2,
      padding: theme.spacing(2),
      borderRadius: theme.shape.borderRadius,
      backgroundColor: theme.palette.grey[900],
    },
  },
}));

// ----------------------------------------------------------------------

export interface Props extends ReactQuillProps {
  id?: string;
  error?: boolean;
  simple?: boolean;
  helperText?: ReactNode;
  sx?: BoxProps;
}

export default function Editor({
  id = "minimal-quill",
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  error,
  value,
  onChange,
  simple = false,
  helperText,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  sx,
  ...other
}: Props) {
  const modules = {
    toolbar: {
      container: `#${id}`,
      handlers: {
        undo: undoChange,
        redo: redoChange,
      },
    },
    history: {
      delay: 500,
      maxStack: 100,
      userOnly: true,
    },
    syntax: true,
    clipboard: {
      matchVisual: false,
    },
  };
  const [textCount, setTextCount] = useState(0);

  useEffect(() => {
    let text = "";

    if (typeof value === "string") {
      text = value;
    } else if (value && typeof value === "object") {
      // use Quill Api to convert the deltastatic string
      const tempContainer = document.createElement("div");
      new Quill(tempContainer).setContents(value);
      text = tempContainer.innerText;
    }

    const textLength = text.replace(/<[^>]*>/g, "").length; // Remove HTML tags /<[^>]*>/g
    setTextCount(textLength);
  }, [value]);

  return (
    <div>
      <RootStyle
        sx={{
          border: `solid 1px rgba(145, 158, 171, 0.32)`,
        }}
      >
        <EditorToolbar id={id} isSimple={simple} />
        <ReactQuill
          value={value}
          onChange={onChange}
          modules={modules}
          formats={formats}
          placeholder="Điền mô tả ..."
          {...other}
        />
      </RootStyle>

      {helperText && helperText}
      <Typography
        variant="body2"
        color="textSecondary"
        sx={{ mt: 1, textAlign: "right" }}
      >
        {textCount} kí tự
      </Typography>
    </div>
  );
}
