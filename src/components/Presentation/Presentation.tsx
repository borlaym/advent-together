import React, { useContext } from "react"
import styled, { css } from "styled-components";
import { StateContext } from "../DataProvider/DataProvider";
import { Background, Modal } from "../Modal/Modal"
import { original, thumbnail } from '../UploadForm/ImageUploader';

type Props = {
  dayNumber: number;
  onClose: () => void;
}

const BGFILLER_ENABLED = true;

const PresentModal = styled(Modal)`
  background-color: white;
  border-radius: 10px;
  box-shadow: 5px 5px 10px 0 rgba(50, 50, 50, 0.7);
  min-width: 95%;
  min-height: 95%;
  overflow: hidden;
`;

const SlideShow = styled.div`
  display: flex;
  flex-wrap: nowrap;
  overflow-x: scroll;
  flex-grow: 1;
  width: 100%;
  height: 100%;
  scroll-snap-type: x mandatory;
`

const Slide = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-shrink: 0;
  scroll-snap-align: center;
  scroll-snap-stop: always;
`;

const SlideInner = styled.div<{ textOnly: boolean }>`
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  overflow-y: scroll;

  // hide scrollbars
  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
  text-align: center;

  ${props => props.textOnly && css`
    text-align: left;
    padding: 2em 4em;
    @media screen and (max-width: 440px) {
      padding: 1.5em;
    }
  `}
`;

const Text = styled.p<{ largeFont?: boolean }>`
  font-size: ${props => props.largeFont ? '2em' : '1.5em'};
  color: rgb(0 0 0 / 70%);
  line-height: 1.6em;
  font-style: italic;
  overflow-wrap: break-word;
`;

const Caption = styled.div`
  font-size: 1.5em;
  display: inline-block;
  margin: 1em auto 1em;
  max-width: 90%;
  text-align: left;
  color: rgb(0 0 0 / 70%);
  line-height: 1.6em;
  font-style: italic;
  overflow-wrap: break-word;
`;

const ImageFill = styled.img`
  display: block;
  max-width: 95%;
  max-height: 95%;
  width: auto;
  height: auto;
  border: 2px solid white;
`;

const Uploader = styled.div`
  font-family: cursive;
  margin-left: 10px;
`;

const Pager = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  font-size: 1.2em;
  padding: 0.5em;
  background-color: white;
  border-radius: 5px;
`;

const BgFiller = styled.div<{ src: string }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  content: '';
  background-image: url(${props => props.src});
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  z-index: -1;
  filter: blur(10px) brightness(1.5);
`;

const Upper = styled.div<{ isFull?: boolean }>`
  height: ${props => props.isFull ? '100%' : '80%'};
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`

const Lower = styled.div`
  height: 20%;
`

export default function Presentation({
  dayNumber,
  onClose
}: Props) {
  const { calendarData } = useContext(StateContext);
  const presents = calendarData.presents.filter(p => p.day === dayNumber);

  return (
    <Background onClick={onClose}>
      <PresentModal onClick={(e: React.MouseEvent) => e.stopPropagation()}>
        <SlideShow>
          {presents.map((present, i) => (
            <Slide key={present.uuid}>
              <Pager>{i+1} / {presents.length}</Pager>
              {present.image ? <MediaSlide present={present} /> : <TextSlide present={present} />}
            </Slide>
          ))}
        </SlideShow>
      </PresentModal>
    </Background>
  )
}

const MediaSlide = ({present}) => {
  return (
    <>
      <SlideInner textOnly={false}>
        <Upper isFull={!present.content && !present.uploaderName}>
          {BGFILLER_ENABLED && <BgFiller src={original(present.image)} />}
          <ImageFill src={original(present.image)} />
        </Upper>

        {(present.content || present.uploaderName) && (
          <Lower>
              <Caption>
                {present.content}
                <Uploader>{present.uploaderName ? `- ${present.uploaderName}` : null}</Uploader>
              </Caption>
          </Lower>
        )}

      </SlideInner>
    </>
  );
}

const TextSlide = ({present}) => {
  return (
    <>
      <SlideInner textOnly={true}>
        <Text largeFont={present.content.length < 300}>{present.content}</Text>
        <Uploader>{present.uploaderName ? `- ${present.uploaderName}` : null}</Uploader>
      </SlideInner>
    </>
  );
}
