import React from 'react'
import { CTAButton } from './CTAButton';
import { TypeAnimation } from 'react-type-animation';
import { FaArrowRight } from 'react-icons/fa';


export const CodeBlocks = ({
    position, heading, subheading, ctabtn1, ctabtn2, codeblock, backgroundGradient, codeColor
}) => {
    return (
        <div className={`flex ${position} my-20 justify-between gap-10 `}>
            {/* section1 */}

            <div className={`w-[50%] flex flex-col gap-8`}>
                {heading}
                <div className='text-richblack-300 font-bold '>
                    {subheading}
                </div>

                <div className='flex gap-7 mt-7'>
                    <CTAButton active={ctabtn1.active} linkto={ctabtn1.linkto}>
                        <div className="flex gap-2 items-center">
                            {ctabtn1.btnText}
                            <FaArrowRight />
                        </div>
                    </CTAButton>

                    <CTAButton active={ctabtn2.active} linkto={ctabtn2.linkto}>

                        {ctabtn2.btnText}

                    </CTAButton>
                </div>

            </div>


            {/* section-2 */}

            <div className='flex flex-row text-[10px] h-fit w-[100%] py-4 lg:w-[500px]'>

                <div className='text-center flex flex-col w-[10%] text-richblack-400 font-inter font-bold'>
                    <p>1</p>
                    <p>2</p>
                    <p>3</p>
                    <p>4</p>
                    <p>5</p>
                    <p>6</p>
                    <p>7</p>
                    <p>8</p>
                    <p>9</p>
                    <p>10</p>
                    <p>11</p>
                </div>
                <div className={`w-[90%] flex flex-col gap-2 font-bold font-mono ${codeColor} pr-2`}>
                    <TypeAnimation
                        sequence={[codeblock, 2000, ""]}
                        repeat={Infinity}
                        cursor={true}
                        omitDeletionAnimation={true}
                        style={
                            {
                                whiteSpace: "pre-line",
                                display: "block"
                            }
                        }
                    />
                </div>
            </div>
        </div>
    )
}
