import React, { useContext, useCallback, useState, useRef, useEffect, useMemo } from "react"
import styled, { css } from "styled-components";
import debounce from 'lodash/debounce';
import useLinkifyUrls, { parseYoutube } from "../../utils/linkify";
import { StateContext } from "../DataProvider/DataProvider";
import { Background, Modal } from "../Modal/Modal"
import { original } from '../UploadForm/ImageUploader';


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

const Text = styled.p`
  color: rgb(0 0 0 / 70%);
  line-height: 1.6em;
  font-style: italic;
  overflow-wrap: break-word;
  max-width: 80%;
  @media screen and (max-width: 440px) {
    max-width: 100%;
  }
`;

const TextWrap = styled.div<{ shortText: boolean }>`
  display: flex;
  min-height: 100%;
  width: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 2em 0;
  box-sizing: border-box;

  font-size: 1.5em;
  @media screen and (max-width: 440px) {
    font-size: 1.2em;
  }

  ${props => props.shortText && css`
    justify-content: center;
    font-size: 2em;
    @media screen and (max-width: 440px) {
      font-size: 1.5em;
    }

    & ${Text} {
      text-align: center;
      max-width: 60%;
      @media screen and (max-width: 440px) {
        max-width: 100%;
      }
    }
  `}
`;


const Caption = styled.div`
  font-size: 1.5em;
  display: inline-block;
  margin: 1em auto 1em;
  width: 60%;
  @media screen and (max-width: 440px) {
    width: 90%;
  }
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
  font-size: 0.9em;
  text-align: right;
  width: 60%;
  @media screen and (max-width: 440px) {
    max-width: 100%;
  }
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

const PagerWrapper = styled.div`
  pointer-events: none;
  // at the bottom of modal
  position: absolute;
  bottom: 0px;
  right: 0;
  width: 100%;
  box-sizing: border-box;
  // with some spacing left form the edges
  padding: 0 1em;
  @media screen and (max-width: 440px) {
    padding: 0 0.2em;
  }
  // aligned with the buttons at the edges
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  // above everything
  z-index: 1;
`;

const PagerButton = styled.a<{ enabled: boolean }>`
  pointer-events: all;
  color: #479e6b;
  text-shadow: 1px 3px 1px #62626261;
  font-size: 10em;
  cursor: pointer;
  @media screen and (max-width: 440px) {
    font-size: 5em;
  }
  transition: opacity 250ms ease-in;
  opacity: ${props => props.enabled ? 1 : 0};
`;

const CloseButton = styled.a`
  position: absolute;
  top: 0;
  right: 0;
  padding: 0.5em;
  z-index: 1;
  cursor: pointer;
  color: #ff434380;
  // text-shadow: 1px 3px 1px #62626261;
  font-size: 1.5em;
`;

export default function Presentation({
  dayNumber,
  onClose
}: Props) {
  const { calendarData } = useContext(StateContext);
  const presents = useMemo(() => {
    const manualPresents = calendarData.presents.filter(p => p.day === dayNumber);
    if (dayNumber === 23) {
      return [...manualPresents, {
        uuid: 'google-form',
        day: 23,
        uploader: 'adventi.site',
        uploaderName: 'Az adventi.site csapata',
        content: 'K??sz??nj??k, hogy haszn??lt??tok az Adventi Napt??rat! Hogy j??v??re m??g jobb legyen, mondd el r??la a v??lem??nyed ezen az ??rlapon: https://docs.google.com/forms/d/e/1FAIpQLSeAsAFE5ONjX3mhrFP0A777g_cq_xE3HFwn7ufZZEU4BsTUoQ/viewform?usp=sf_link Mindenkinek kellemes ??nnepeket k??v??nunk!'
      }];
    }
    return manualPresents
  }, [calendarData.presents, dayNumber]);

  // paging related
  const sliderRef = useRef<HTMLDivElement | null>(null);
  const [hasNextPage, setHasNextPage] = useState(presents.length > 1);
  const [hasPrevPage, setHasPrevPage] = useState(false);

  function getCurrentIndex() {
    if (!sliderRef.current) {
      return 0;
    }
    const width = sliderRef.current.offsetWidth;
    const leftPos = sliderRef.current.scrollLeft;
    return Math.round(leftPos / width);
  }

  function gotoIndex(index) {
    if (!sliderRef.current.childNodes[index]) {
      return;
    }
    sliderRef.current.childNodes[index].scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'center'
    });
  }

  const gotoPrevPage = useCallback(() => {
    gotoIndex(getCurrentIndex() - 1);
  }, []);

  const gotoNextPage = useCallback(() => {
    gotoIndex(getCurrentIndex() + 1);
  }, []);

  const handleKeydown = useCallback((event: KeyboardEvent) => {
    if (event.keyCode === 37) {
      gotoPrevPage();
    }
    if (event.keyCode === 39) {
      gotoNextPage();
    }

  }, [gotoNextPage, gotoPrevPage]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeydown);
    return () => {
      document.removeEventListener('keydown', handleKeydown);
    }
  }, [])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const scrollHandler = useCallback(debounce(function scrollPosChecker() {
    if (!sliderRef.current) {
      return;
    }
    const width = sliderRef.current.offsetWidth;
    const scrollWidth = sliderRef.current.scrollWidth;
    const leftPos = sliderRef.current.scrollLeft;

    setHasPrevPage(leftPos > 0);
    setHasNextPage((leftPos + width) < (scrollWidth - 50));
  }, 30, { leading: false, trailing: true }), []);

  return (
    <Background onClick={onClose}>
      <PresentModal onClick={(e: React.MouseEvent) => e.stopPropagation()}>

        <PagerWrapper>
          <PagerButton onClick={gotoPrevPage} enabled={hasPrevPage}>???</PagerButton>
          <PagerButton onClick={gotoNextPage} enabled={hasNextPage}>???</PagerButton>
        </PagerWrapper>

        <CloseButton onClick={onClose}>???</CloseButton>

        <SlideShow ref={sliderRef} onScroll={scrollHandler}>
          {presents.map((present, i) => {
            const youtubeId = parseYoutube(present.content);

            const slideContent = (() => {
              if (youtubeId) {
                return <YoutubeSlide id={youtubeId} present={present} />;
              }
              if (present.image) {
                return <MediaSlide present={present} />;
              }
              return <TextSlide present={present} />
            })();

            return (
              <Slide key={present.uuid}>
                {slideContent}
              </Slide>
            );
          })}
          {presents.length === 0 && (
            <SlideInner textOnly={true}>
              <Text>A mai napra senki nem t??lt??tt f??l semmit :(</Text>
            </SlideInner>
          )}
        </SlideShow>
      </PresentModal>
    </Background>
  )
}

const MediaSlide = ({present}) => {
  const textContainerRef = useLinkifyUrls();
  return (
    <>
      <SlideInner textOnly={false}>
        <Upper isFull={!present.content && !present.uploaderName}>
          {BGFILLER_ENABLED && <BgFiller src={original(present.image)} />}
          <ImageFill src={original(present.image)} />
        </Upper>

        {(present.content || present.uploaderName) && (
          <Lower>
              <Caption ref={textContainerRef}>
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
  const textContainerRef = useLinkifyUrls();
  return (
    <>
      <SlideInner textOnly={true}>
        <TextWrap shortText={present.content.length < 300}>
          <Text ref={textContainerRef}>{present.content}</Text>
          <Uploader>{present.uploaderName ? `- ${present.uploaderName}` : null}</Uploader>
        </TextWrap>
      </SlideInner>
    </>
  );
}

function YoutubeSlide({ id, present }) {
  return (
    <SlideInner textOnly={false}>
      <Upper isFull={!present.uploaderName}>
        <iframe
          width="100%"
          height="100%"
          src={`https://www.youtube.com/embed/${id}`}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </Upper>
      {present.uploaderName && (<Lower>
        <Caption>
          <Uploader>{`- ${present.uploaderName}`}</Uploader>
        </Caption>
      </Lower>)}
    </SlideInner>
  );
}
