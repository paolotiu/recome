import React from "react";
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
    width: "clamp(300px, 30vw, 500px)",

    right: "auto",
    bottom: "auto",
    borderRadius: "24px",
    marginRight: "-50%",
    transform: "translate(-50%, -30%)",
    backgroundColor: "#302f2f",
    border: "none",
    textTransform: "capitalize",
    overflow: "visible",
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
