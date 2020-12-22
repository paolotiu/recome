import React, { useEffect } from "react";
import styled from "styled-components";
import { CreatePlaylistResult } from "../../../../types";
import { Button } from "../../../General";
const ModalContent = styled.div`
  transition: all 0.4s ease-in;
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

  .playlist-preview-after {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    height: 100%;
    h3 {
      font-size: 1.6em;
    }
    button {
      height: 60px;
      font-size: 1.4em;
    }
  }

  .hidden {
    display: none;
  }
`;
interface Props {
  playlistName: string;
  setPlaylistName: React.Dispatch<React.SetStateAction<string>>;
  createPlaylist: () => void;
  data: CreatePlaylistResult | undefined;
  isStale: boolean;
}

export const CreatingPlaylistModal: React.FC<Props> = ({
  playlistName,
  setPlaylistName,
  createPlaylist,
  data,
  isStale,
}) => {
  useEffect(() => {
    const form = document.querySelector(
      ".create-playlist-form"
    ) as HTMLFormElement;
    const btn = document.querySelector(
      ".playlist-preview-after"
    ) as HTMLDivElement;
    if (!isStale) {
      form.classList.add("go-out");

      setTimeout(() => {
        btn.classList.remove("hidden");
        form.classList.add("hidden");

        btn.classList.add("go-in");
      }, 1000);
    } else {
      form.classList.remove("go-out");
    }
  }, [data, isStale]);
  return (
    <>
      <ModalContent className="create-playlist-modal">
        <form
          className="create-playlist-form"
          onSubmit={(e) => {
            e.preventDefault();
            createPlaylist();

            (document.querySelector(
              "#create-playlist"
            ) as HTMLButtonElement).disabled = true;
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
          <Button
            id="create-playlist"
            className="create-playlist-btn"
            type="submit"
          >
            Create Playlist
          </Button>
        </form>

        <div className="playlist-preview-after hidden">
          <h3>{data?.name}</h3>
          <Button newTab={true} link={data?.external_urls.spotify}>
            Listen on Spotify
          </Button>
        </div>
      </ModalContent>
    </>
  );
};
