import React, { useEffect } from "react";
import ReactModal from "react-modal";
interface Props extends ReactModal.Props {}

const CustomModalStyles = {
  overlay: {
    zIndex: 1000,
    backgroundColor: "rgba(170,170,170, 0.2)",
  },
  content: {
    display: "grid",
    position: "relative",
    gap: "1.2em",

    top: "30%",
    left: "50%",

    transition: "all 1s ease-in",
    right: "auto",
    bottom: "auto",
    borderRadius: "24px",
    marginRight: "-50%",
    transform: "translate(-50%, -40%)",
    backgroundColor: "#222",
    border: "none",
    textTransform: "capitalize",
    overflow: "visible",

    width: "clamp(400px, 90vw, 800px)",
  } as React.CSSProperties,
};

ReactModal.setAppElement("#root");
export const Modal: React.FC<Props> = ({
  isOpen,
  style,
  onRequestClose,
  children,
  shouldCloseOnOverlayClick,
  onAfterClose,
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);
  return (
    <ReactModal
      isOpen={isOpen}
      shouldCloseOnOverlayClick={shouldCloseOnOverlayClick}
      style={{
        ...CustomModalStyles,
        ...style,
      }}
      onRequestClose={onRequestClose}
      onAfterClose={onAfterClose}
    >
      {children}
    </ReactModal>
  );
};
