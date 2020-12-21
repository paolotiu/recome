import Slider, { RangeProps } from "rc-slider";
import "rc-slider/assets/index.css";
import styled from "styled-components";

const RangeWithFixedPushable = Slider.Range as React.ComponentClass<
  Omit<RangeProps, "pushable"> & { pushable?: number | boolean }
>;
const StyledSlider = styled(RangeWithFixedPushable)`
  margin-bottom: 5px;
  .rc-slider-handle {
    border: none;
    background-color: ${(props) => props.theme.light};
  }

  .rc-slider-rail {
    background-color: ${(props) => props.theme.lightenedDark};
  }

  .rc-slider-track {
    background-color: ${(props) => props.theme.secondary};
  }

  .rc-slider-handle-dragging.rc-slider-handle-dragging.rc-slider-handle-dragging {
    border: none;
    box-shadow: 0 0 0 2px ${(props) => props.theme.secondary};
  }
  .rc-slider-step {
    display: none;
  }
`;

export { StyledSlider as Slider };
