import React from "react";
import styled from "styled-components";
import { Button } from "../../../General";

const ModalContent = styled.div`
  width: 100%;
  overflow: hidden;
  form {
    width: 100%;
    display: flex;
    flex-direction: column;
    .input-container {
      max-width: 100%;
      display: flex;
      flex-direction: column;
      margin-bottom: 2em;
      label {
        font-weight: 600;
        font-size: 1.5em;
      }
      input {
        margin-top: 10px;
        background-color: transparent;
        border-radius: 20px;
        height: 50px;
        padding: 0 1em;
        font-size: 0.8em;
        color: ${(props) => props.theme.light};
        outline: none;
      }
    }
    .create-playlist-btn {
      height: 40px;
      font-size: 1em;
    }
  }
`;
interface Props {
  playlistName: string;
  setPlaylistName: React.Dispatch<React.SetStateAction<string>>;
  createPlaylist: () => void;
}

export const CreatingPlaylistModal: React.FC<Props> = ({
  playlistName,
  setPlaylistName,
  createPlaylist,
}) => {
  return (
    <ModalContent>
      <form
        action=""
        onSubmit={(e) => {
          e.preventDefault();
          createPlaylist();
        }}
      >
        <div className="input-container">
          <label htmlFor="playlist-name">Playlist Name</label>
          <input
            type="text"
            name="playlist-name"
            value={playlistName}
            onChange={(e) => setPlaylistName(e.target.value)}
          />
        </div>

        <Button className="create-playlist-btn" type="submit">
          Create Playlist
        </Button>
      </form>
    </ModalContent>
  );
};
