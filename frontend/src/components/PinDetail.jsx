import React, { useEffect, useState } from "react";
import { MdDownloadForOffline } from "react-icons/md";
import { Link, useNavigate, useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { client, urlFor } from "../client";
import { BsFillArrowUpRightCircleFill } from "react-icons/bs";
import MasonryLayout from "./MasonryLayout";
import { pinDetailMorePinsQuery, pinDetailQuery } from "../utils/data";
import Spinner from "./Spinner";

const PinDetail = ({ user }) => {
  const [relatedPins, setRelatedPins] = useState(null);
  const [pinDetail, setPinDetail] = useState(null);
  const [comment, setComment] = useState("");
  const [addingComment, setAddingComment] = useState(false);
  const navigate = useNavigate();
  const { pinId } = useParams();

  const fetchPinDetail = () => {
    let query = pinDetailQuery(pinId);

    if (query) {
      client.fetch(query).then((data) => {
        if (data[0]) {
          setPinDetail(data[0]);
          query = pinDetailMorePinsQuery(data[0]);
          client.fetch(query).then((res) => {
            setRelatedPins(res);
          });
        }
      });
    }
  };

  useEffect(() => {
    fetchPinDetail();
  }, [pinId]);

  if (!pinDetail) return <Spinner message="Loading pin." />;

  const addComment = () => {
    if (comment) {
      setAddingComment(true);

      client
        .patch(pinId)
        .setIfMissing({ comments: [] })
        .insert("after", "comments[-1]", [
          {
            comment,
            _key: uuidv4(),
            postedBy: { _type: "postedBy", _ref: user?._id },
          },
        ])
        .commit()
        .then(() => {
          fetchPinDetail();
          setComment("");
          setAddingComment(false);
        });
    }
  };

  return (
    <>
      <div
        className="flex xl:flex-row flex-col m-auto bg-white"
        style={{ maxWidth: "1500px", borderRadius: "32px" }}
      >
        <div className="flex justify-center items-center md:items-start flex-initial">
          <img
            src={pinDetail?.image && urlFor(pinDetail?.image).url()}
            alt="image"
            className="rounded-t-3xl rounded-b-lg"
          />
        </div>
        <div className="w-full p-5 flex-1 xl:min-w-620">
          <div className="flex items-center justify-between">
            <div className="flex gap-2 items-center">
              <a
                href={`${pinDetail?.image?.asset?.url}?dl=`}
                download
                onClick={(e) => e.stopPropagation()}
                className="bg-white w-9 h-9 rounded-full flex items-center justify-center text-dark text-xl opacity-75 hover:opacity-100 hover:bg-gray-200 hover:shadow-lg outline-none"
              >
                <MdDownloadForOffline />
              </a>
            </div>
            <a
              className="bg-gray-100 p-2 rounded-full flex items-center gap-2"
              href={pinDetail?.destination}
              target="_blank"
              rel="noreferrer"
            >
              <BsFillArrowUpRightCircleFill /> {pinDetail?.destination}
            </a>
          </div>
          <div>
            <h1 className="text-3xl font-bold break-words mt-3">
              {pinDetail?.title}
            </h1>
            <p className="mt-3">{pinDetail?.about}</p>
          </div>
          <Link
            to={`/user-profile/${pinDetail?.postedBy?._id}`}
            className="flex gap-2 mt-5 items-center bg-white rounded-lg"
          >
            <img
              src={pinDetail?.postedBy?.image}
              className="w-8 h-8 rounded-full object-cover"
              alt="user-profile"
            />
            <p className="capitalize font-medium">
              {pinDetail?.postedBy?.userName}
            </p>
          </Link>
          <h2 className="mt-5 text-2xl">Comments</h2>
          <div className="max-h-370 overflow-y-auto">
            {pinDetail?.comments?.map((comment, index) => (
              <div
                key={index}
                className="flex gap-2 mt-5 items-center bh-white rounded-lg"
              >
                <img
                  src={comment?.postedBy?.image}
                  alt="image"
                  className="w-10 h-10 rounded-full cursor-pointer"
                />
                <div className="flex flex-col">
                  <p className="font-semibold">{comment?.postedBy?.userName}</p>
                  <p>{comment?.comment}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex -flex-wrap mt-6 gap-3">
            <Link to={`/user-profile/${user?._id}`}>
              <img
                src={user?.image}
                className="w-10 h-10 rounded-full cursor-pointer"
                alt="user-profile"
              />
            </Link>
            <input
              type="text"
              className="flex-1 border-gray-100 outline-none border-2 p-2 rounded-2xl focus:border-gray-300"
              placeholder="Add a comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <button
              type="button"
              className="bg-red-500 hover:bg-red-600 text-white rounded-full px-6 py-2 font-semibold text-base outline-none"
              onClick={addComment}
            >
              {addingComment ? "Posting..." : "Post"}
            </button>
          </div>
        </div>
      </div>
      {relatedPins?.length > 0 ? (
        <>
          <h2 className="text-center font-bold text-2xl mt-8 mb-4">
            More like this.
          </h2>
          <MasonryLayout pins={relatedPins} />
        </>
      ) : (
        <div className="flex flex-col justify center items-center">
          <h2 className="text-center font-bold text-2xl mt-8 mb-4">
            Be the second one to create similar pin.
          </h2>
          <button
            type="button"
            className="bg-red-500 hover:bg-red-600 text-white rounded-full px-6 py-2 font-semibold text-base outline-none"
            onClick={() => {
              navigate("/create-pin");
            }}
          >
            Create pin
          </button>
        </div>
      )}
    </>
  );
};

export default PinDetail;
