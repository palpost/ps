'use client';
import { SocialPlatform } from '@/types';
import download from 'downloadjs';
import { toJpeg, toPng } from 'html-to-image';
import { setData } from './api/dataUseing/data';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import {
  FaArrowRotateLeft,
  FaUpload,
  FaDownload,
  FaGithub,
  FaGitlab,
  FaXTwitter,
  FaTwitter,
  FaFacebook,
  FaLinkedin,
  FaPinterest,
  FaWhatsapp
} from 'react-icons/fa6';

export default function Home() {
  const ref = useRef<HTMLDivElement>(null);
  const [userImageUrl, setUserImageUrl] = useState<string | null>(null);

  const [unsuportedBrowser, setUnsupportedBrowser] = useState(false);
  const [loader, setLoader] = useState(false);
  const [gazaStatusSummary, setGazaStatusSummary] = useState();
  const [filePostfix, setFilePostfix] = useState<
    SocialPlatform | 'user-upload'
  >();
  const [imageSize, setImageSize] = useState<number | null>(null);
  const [printImage, setPrintImage] = useState(false);
  const [dataUpdate, setDataUpdate] = useState(null);
  const [userDatas, setUserDatas] = useState(false);
  const [userID, setUserID] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState('jpeg');

  const shareTitle = 'Show Solidarity';
  const shareUrl = 'https://swp.pmix.net/';

  const shareOnTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(twitterUrl, '_blank');
  };

  const shareOnFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    window.open(facebookUrl, '_blank');
  };

  const shareOnLinkedin = () => {
    const linkedinUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(shareTitle)}`;
    window.open(linkedinUrl, '_blank');
  };

  const shareOnPinterest = () => {
    const pinterestUrl = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(shareUrl)}&media=${encodeURIComponent(shareUrl)}&description=${encodeURIComponent(shareTitle)}`;
    window.open(pinterestUrl, '_blank');
  };

  const shareOnWhatsapp = () => {
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareTitle)}%20${encodeURIComponent(shareUrl)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedType(event.target.value);
  };

  useEffect(() => {
    const fetchDataUser = async () => {
      try {
        if (userDatas) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          await setData(userID, userImageUrl, false, null);
          setUserDatas(false);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };
    fetchDataUser();
    return () => {};
  }, [userDatas]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseUpdate = await fetch('/api/update');
        const dataUpdate = await responseUpdate.json();
        setDataUpdate(dataUpdate.lastUpdate);

        await new Promise((resolve) => setTimeout(resolve, 4000));

        //await fetch('/api/userData');
        //const dataUser = await responseUserData.json();
        //setUserDatas(dataUser.status);
        //console.log(dataUser)
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };
    fetchData();
    return () => {};
  }, [dataUpdate]);

  useEffect(() => {
    const isInstagramBrowser = /Instagram/i.test(navigator.userAgent);
    const isFacebookBrowser = /FBAN|FBAV/i.test(navigator.userAgent);

    if (isInstagramBrowser || isFacebookBrowser) {
      setUnsupportedBrowser(true);
    }
  }, [unsuportedBrowser]);

  useEffect(() => {
    fetch('/api/status')
      .then((res) => res.json())
      .then((data) => setGazaStatusSummary(data.summary));
  }, [gazaStatusSummary]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file: File | undefined = e.target.files?.[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = async (event: ProgressEvent<FileReader>) => {
        const image = new window.Image();
        image.onload = () => {
          const width = image.width;
          const height = image.height;
          if (width < height) {
            setImageSize(width);
          } else {
            setImageSize(height);
          }
          setFilePostfix('user-upload');
          setUserImageUrl(event.target?.result as string);
        };
        image.src = event.target?.result as string;
      };

      reader.onerror = (error) => {
        console.error('Error reading file:', error);
      };

      reader.readAsDataURL(file);
    } else {
      console.error('No file selected.');
    }
  };

  const handleUploadButtonClick = () => {
    document.getElementById('fileInput')?.click();
  };

  const handleRetrieveProfilePicture = async (platform: SocialPlatform) => {
    const userProvidedUsername = prompt(`Enter your ${platform} username:`);

    if (userProvidedUsername) {
      setFilePostfix(platform);
      try {
        setLoader(true);
        const response = await fetch(
          `/api/retrieve-profile-pic?username=${userProvidedUsername}&platform=${platform}`
        ).then((res) => (res.ok ? res.json() : null));
        setLoader(false);
        if (response === null) {
          alert(
            'Error fetching your profile picture. Please make sure that you entered a correct username.'
          );
          return;
        } else {
          setUserID(userProvidedUsername);
        }
        const image = new window.Image();
        image.onload = () => {
          const width = image.width;
          const height = image.height;
          if (width < height) {
            setImageSize(width);
          } else {
            setImageSize(height);
          }
          setUserImageUrl(response.profilePicUrl);
        };
        image.src = response.profilePicUrl;
      } catch (error) {
        console.error('Error fetching profile picture:', error);
      }
    }
  };

  const generateImage = async () => {
    setUserDatas(true);
    const node = ref.current as HTMLElement;
    const options = {
      backgroundColor: 'white'
    };

    try {
      if (selectedType == 'png') return await toPng(ref.current as HTMLElement);
      else {
        return await toJpeg(node, options);
      }
    } catch (error) {
      console.log('Error generating image', error);
    }
  };

  const handleDownload = async () => {
    setPrintImage(true);
    setTimeout(async () => {
      await generateImage();
      await generateImage();
      await generateImage();
      const generatedImageUrl = await generateImage();
      if (generatedImageUrl) {
        download(generatedImageUrl, `profile-pic-${filePostfix}.png`);
        setPrintImage(false);
      }
    }, 500);
  };

  const startOver = async () => {
    setUserImageUrl(null);
  };

  return (
    <>
      <main className="text-center px-8 py-12 flex-column max-w-xl mx-auto flex justify-center align-center items-center min-h-screen">
        <div>
          {unsuportedBrowser && (
            <div className="border p-2 rounded-lg bg-yellow-200 my-2  text-sm mb-8">
              <p className="font-semibold">⚠️ Unsupported Browser Detected</p>
              <p>Please open on regular browsers like Chrome or Safari.</p>
            </div>
          )}
          {gazaStatusSummary && (
            <span className="rounded-lg bg-gray-200 py-1.5 px-4 text-sm text-gray-800 cursor-pointer">
              😥 {gazaStatusSummary}
            </span>
          )}
          <h1 className="font-semibold text-3xl mt-6">Show Solidarity 🇵🇸</h1>
          <p className="text-lg py-2">
            Let&apos;s unite in our profile pictures to spotlight the cause. ✊
          </p>

          <div className="my-12">
            <div className="flex justify-center">
              <div
                style={{ width: '300px', height: '300px' }}
                className="relative"
              >
                <img
                  width={100}
                  height={100}
                  alt="border"
                  id="borderImage"
                  src={'/flag.svg'}
                  style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%'
                  }}
                  className="rounded-full"
                />
                {loader ? (
                  <img
                    id="spinner"
                    alt="spinner-animation"
                    src={'/spinner.svg'}
                    width={100}
                    height={100}
                    style={{
                      position: 'absolute',
                      width: '85%',
                      height: '85%',
                      left: '7.5%',
                      top: '7.5%'
                    }}
                    className="object-cover rounded-full cursor-wait"
                  />
                ) : (
                  <img
                    id="userImage"
                    alt="profile-image"
                    src={userImageUrl ?? '/user.jpg'}
                    width={100}
                    height={100}
                    style={{
                      position: 'absolute',
                      width: '85%',
                      height: '85%',
                      left: '7.5%',
                      top: '7.5%'
                    }}
                    className="object-cover rounded-full cursor-pointer"
                  />
                )}
              </div>
            </div>
          </div>
          <div>
            {userImageUrl ? (
              <>
                <p className="p-2 my-6 text-sm border rounded-lg">
                  Download the image, then use it as your new profile picture.
                </p>
                <div style={{ marginBottom: 5 + 'px' }}>
                  <label style={{ marginRight: 15 + 'px' }}>
                    <input
                      style={{ marginRight: 10 + 'px' }}
                      type="radio"
                      value="png"
                      checked={selectedType === 'png'}
                      onChange={handleTypeChange}
                    />
                    PNG
                  </label>
                  <label style={{ marginLeft: 15 + 'px' }}>
                    <input
                      style={{ marginRight: 10 + 'px' }}
                      type="radio"
                      value="jpeg"
                      checked={selectedType === 'jpeg'}
                      onChange={handleTypeChange}
                    />
                    JPEG
                  </label>
                </div>

                <button
                  onClick={handleDownload}
                  className="rounded-full mb-2 py-3 px-2 w-full border border-gray-900 bg-gray-900 text-white text-xl"
                >
                  Download Image{' '}
                  <FaDownload className="inline mb-1 ml-2 text-md" />
                </button>
                <button
                  onClick={startOver}
                  className="rounded-full my-2 py-3 px-2 w-full border border-gray-900 text-xl"
                >
                  Start Over{' '}
                  <FaArrowRotateLeft className="inline mb-1 ml-2 text-md" />
                </button>
              </>
            ) : (
              <>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="fileInput"
                />
                <button
                  onClick={handleUploadButtonClick}
                  className="rounded-full my-2 py-3 px-2 w-full border border-gray-900 text-xl"
                >
                  Upload Image
                  <FaUpload className="inline mb-1 ml-2 text-md" />
                </button>
                <button
                  onClick={async () =>
                    await handleRetrieveProfilePicture(SocialPlatform.Twitter)
                  }
                  className="rounded-full my-2 py-3 px-2 w-full border border-gray-900 text-xl"
                >
                  Use <FaXTwitter className="inline mb-1" /> Profile Pic
                </button>
                <button
                  onClick={async () =>
                    await handleRetrieveProfilePicture(SocialPlatform.Github)
                  }
                  className="rounded-full my-2 py-3 px-2 w-full border border-gray-900 text-xl"
                >
                  Use <FaGithub className="inline mb-1" /> Profile Pic
                </button>
                <button
                  onClick={async () =>
                    await handleRetrieveProfilePicture(SocialPlatform.Gitlab)
                  }
                  className="rounded-full my-2 py-3 px-2 w-full border border-gray-900 text-xl"
                >
                  Use <FaGitlab className="inline mb-1" /> Profile Pic
                </button>
              </>
            )}
          </div>
          <div className="pt-8">
            <p className="p-2 my-6 text-sm border rounded-lg">
              Note: This app runs purely on your browser end. No images nor data
              will be saved by the app.
            </p>
            <p className="text-gray-600">
              from{' '}
              <a
                href="https://data.techforpalestine.org/"
                target="_blank"
                className="underline cursor-pointer"
              >
                Palestine Datasets
              </a>
            </p>
            {dataUpdate && (
              <p className="text-gray-600">last Update: {dataUpdate}</p>
            )}

            <p className="text-gray-600 mt-3 mb-2">
              Tell your friends about solidarity
            </p>
            <div
              style={{
                fontSize: 25 + 'px',
                display: 'flex',
                alignItems: 'center',
                gap: 10 + 'px',
                color: '#515151',
                justifyContent: 'center'
              }}
            >
              <button onClick={shareOnTwitter}>
                <FaTwitter size={24} />
              </button>
              <button onClick={shareOnFacebook}>
                <FaFacebook size={24} />
              </button>
              <button onClick={shareOnLinkedin}>
                <FaLinkedin size={24} />
              </button>
              <button onClick={shareOnPinterest}>
                <FaPinterest size={24} />
              </button>
              <button onClick={shareOnWhatsapp}>
                <FaWhatsapp size={24} />
              </button>
            </div>
          </div>
        </div>

        {userImageUrl && imageSize && printImage && (
          <div
            style={{ width: imageSize + 'px', height: imageSize + 'px' }}
            className="relative"
            ref={ref}
          >
            <Image
              width={100}
              height={100}
              alt="border"
              id="borderImage"
              src={'/flag.svg'}
              style={{ position: 'absolute', width: '100%', height: '100%' }}
              className="rounded-full"
              unoptimized
            />
            {loader ? (
              <Image
                id="spinner"
                alt="spinner-animation"
                src={'/spinner.svg'}
                width={100}
                height={100}
                style={{
                  position: 'absolute',
                  width: '85%',
                  height: '85%',
                  left: '7.5%',
                  top: '7.5%'
                }}
                className="object-cover rounded-full cursor-wait"
              />
            ) : (
              <Image
                id="userImage"
                alt="profile-image"
                src={userImageUrl ?? '/user.jpg'}
                width={100}
                height={100}
                style={{
                  position: 'absolute',
                  width: '85%',
                  height: '85%',
                  left: '7.5%',
                  top: '7.5%'
                }}
                className="object-cover rounded-full cursor-pointer"
              />
            )}
          </div>
        )}
      </main>
    </>
  );
}
