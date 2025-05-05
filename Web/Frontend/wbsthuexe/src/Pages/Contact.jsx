import React, { useState } from "react";

const ContactPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [comments, setComments] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Xử lý logic submit form
    console.log("Form submitted", { name, email, comments });
  };

  return (
    <div className="">
      <div className=" text-[#ffffff] h-[250px] md:h-[400px] bg-[#222222] flex items-center">
        <div className=" w-[70%] items-center flex flex-col  gap-5 mx-auto mt-[6vw]">
          <h1 className="text-2xl text-center md:text-4xl font-bold uppercase">
            Liên hệ MOTOVIP Việt Nam
          </h1>
          <p className="text-xs md:text-xl">
            Chọn loại xe và địa điểm, thời gian nhận xe.
          </p>
        </div>
      </div>
      <div className="container bg-[#f6f6f6] my-5 rounded-md  mx-auto px-4 py-8 flex flex-col md:flex-row max-w-5xl">
        <div className="w-full    md:w-1/2 pr-0 md:pr-8">
          <h1 className="text-3xl font-bold mb-6 text-[#dd5c36]">
            Liên hệ với MOTOVIP
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-2 text-[#777777] font-semibold">
                Name <span className="text-[#dd5c36]">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 text-[#777777] py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#dd5c36]"
                required
              />
            </div>

            <div>
              <label className="block mb-2 text-[#777777] font-semibold">
                Email <span className="text-[#dd5c36]">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 text-[#777777] border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#dd5c36]"
                required
              />
            </div>

            <div>
              <label className="block mb-2 text-[#777777] font-semibold">
                Comments <span className="text-[#dd5c36]">*</span>
              </label>
              <textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                className="w-full px-3 py-2 text-[#777777] border rounded-lg h-32 focus:outline-none focus:ring-2 focus:ring-[#dd5c36]"
                maxLength={600}
                required
              />
              <p className="text-sm text-[#777777] font-semibold mt-1">
                {comments.length} / 600 characters
              </p>
            </div>

            <button
              type="submit"
              className="max-w-[120px] bg-[#dd5c36] text-white p-3 rounded-sm transition duration-300"
            >
              SUBMIT
            </button>
          </form>
        </div>

        <div className="w-full md:w-1/2 text-[#777777] mt-8 md:mt-0">
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-2">Địa chỉ cửa hàng</h2>
            <p className="font-semibold">30 Ngõ 66 P Nguyễn Hoàng</p>
          </div>
          <div className="w-full h-96">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.6990457269387!2d105.80623347480724!3d21.00586708837367!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ac9d4f013311%3A0xe786cab7fd8eba3b!2zMzAgTmdoxqEgNjYgTmd1eeG7hW4gSG9hbmcsIE3hu7kgxJDhunMsIEPhuqd1IEdp4bqleSwgSMOgIE7hu5lpLCBWaeG7h3QgTmFt!5e0!3m2!1svi!2s!4v1688975234567!5m2!1svi!2s"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
                title="Bản đồ vị trí cửa hàng Himoto Việt Nam"

              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
