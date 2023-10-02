import React, { useState } from "react";
import Logo from "../assets/logo.png";
import Camera from "../assets/video-camera.svg";
import Monitor from "../assets/monitor.svg";
import Microphone from "../assets/microphone.svg";
import Copy from "../assets/copy.svg";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { IoSettingsOutline, IoToggle } from "react-icons/io5";
import { LiaToggleOffSolid } from "react-icons/lia";
import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "../Context";

const PopUp = () => {
  const { startRecording, stopRecording, status } = useGlobalContext();

  const [toggleCamera, setToggleCamera] = useState(false);
  const [toggleMicrophone, setToggleMicrophone] = useState(false);
  const [recording, setRecording] = useState(false);

  const navigate = useNavigate()

  

  const handleRecordings = () => {
    if (status === "recording") {
      stopRecording();
      navigate('/recorded-video')
    } else {
      startRecording();
    }
    setRecording(!recording);
  };

  const handleToggleCamera = () => {
    setToggleCamera(!toggleCamera);
  };
  const handleToggleMicrophone = () => {
    setToggleMicrophone(!toggleMicrophone);
  };

  return (
    <div className="w-[300px] h-[439px] flex flex-col justify-between shadow-lg rounded-[24px] p-[24px]">
      <div className="flex items-center justify-between">
        <img src={Logo} alt="Logo" className="w-1/2" />
        <div className="flex items-center gap-3 text-[20px] text-[#120B48]">
          <IoSettingsOutline />
          <AiOutlineCloseCircle className="text-[#B6B3C6]" />
        </div>
      </div>

      <p className="text-[#413C6D]">
        This extension helps you record and share help videos with ease.
      </p>

      <div className="flex justify-evenly">
        <div className="flex flex-col items-center cursor-pointer text-[#928FAB]">
          <img src={Monitor} alt="Monitor" />
          <p>Full screen</p>
        </div>
        <div className="flex flex-col items-center cursor-pointer">
          <img src={Copy} alt="" />
          <p>Current Tab</p>
        </div>
      </div>

      <div className="flex items-center justify-between border border-[#100A42] py-[8px] pl-[16px] pr-[12px] rounded-[12px]">
        <div className="flex items-center text-[#100A42]">
          <img src={Camera} alt="" />
          <p>Camera</p>
        </div>
        <button
          onClick={handleToggleCamera}
          className="text-[#120B48] text-[36px]"
        >
          {toggleCamera ? <LiaToggleOffSolid /> : <IoToggle />}
        </button>
      </div>

      <div className="flex items-center justify-between border border-[#100A42] py-[8px] pl-[16px] pr-[12px] rounded-[12px]">
        <div className="flex items-center text-[#100A42]">
          <img src={Microphone} alt="" />
          <p>Audio</p>
        </div>
        <button
          onClick={handleToggleMicrophone}
          className="text-[#120B48] text-[36px]"
        >
          {toggleMicrophone ? <LiaToggleOffSolid /> : <IoToggle />}
        </button>
      </div>

      {status === "recording" ? (
        <button
          onClick={handleRecordings}
          className="bg-[#120B48] active:shadow-lg hover:bg-[#413C6D] text-white p-[16px] rounded-[12px]"
        >
          Stop Recording
        </button>
      ) : (
        <button
          onClick={handleRecordings}
          className="bg-[#120B48] active:shadow-lg hover:bg-[#413C6D] text-white p-[16px] rounded-[12px]"
        >
          Start Recording
        </button>
      )}
    </div>
  );
};

export default PopUp;
