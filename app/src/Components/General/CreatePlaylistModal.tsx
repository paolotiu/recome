import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import { CreatePlaylistResult } from "../../types";
import { Button } from "./Button";
import { ReactComponent as Spotify } from "../../static/spotify.svg";
import { toast } from "react-hot-toast";
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
      color: ${(props) => props.theme.light};
      background-color: ${(props) => props.theme.spotify};
      height: 60px;
      font-size: 1.4em;
      display: flex;
      justify-content: center;
      align-items: center;
      #spotify-logo {
        fill: ${(props) => props.theme.light};
        position: relative;
        left: -10px;
        height: 100%;
        width: 30px;
      }
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

export const CreatePlaylistModal: React.FC<Props> = ({
  playlistName,
  setPlaylistName,
  createPlaylist,
  data,
  isStale,
}) => {
  const formRef = useRef<HTMLFormElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const form = formRef.current;
    const btn = previewRef.current;
    if (form && btn) {
      if (!isStale) {
        form.classList.add("go-out");
        toast.dismiss();
        toast.success("Created!");
        setTimeout(() => {
          btn.classList.remove("hidden");
          form.classList.add("hidden");

          btn.classList.add("go-in");
        }, 1000);
      } else {
        form.classList.remove("go-out");
      }
    }
  }, [data, isStale]);
  return (
    <>
      <ModalContent className="create-playlist-modal">
        <form
          ref={formRef}
          className="create-playlist-form"
          onSubmit={(e) => {
            e.preventDefault();
            createPlaylist();
            toast.loading("Making Playlist");

            if (formRef.current) {
              formRef.current.disabled = true;
            }
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

        <div className="playlist-preview-after hidden" ref={previewRef}>
          <h3>{data?.name}</h3>
          <Button newTab={true} link={data?.external_urls.spotify}>
            <Spotify id="spotify-logo" />
            Listen on Spotify
          </Button>
        </div>
      </ModalContent>
    </>
  );
};
