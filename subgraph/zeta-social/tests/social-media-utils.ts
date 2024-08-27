import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  CommentAdded,
  PostCreated,
  PostLiked,
  UserRegistered
} from "../generated/SocialMedia/SocialMedia"

export function createCommentAddedEvent(
  commenter: Address,
  postId: BigInt,
  content: string,
  timestamp: BigInt
): CommentAdded {
  let commentAddedEvent = changetype<CommentAdded>(newMockEvent())

  commentAddedEvent.parameters = new Array()

  commentAddedEvent.parameters.push(
    new ethereum.EventParam("commenter", ethereum.Value.fromAddress(commenter))
  )
  commentAddedEvent.parameters.push(
    new ethereum.EventParam("postId", ethereum.Value.fromUnsignedBigInt(postId))
  )
  commentAddedEvent.parameters.push(
    new ethereum.EventParam("content", ethereum.Value.fromString(content))
  )
  commentAddedEvent.parameters.push(
    new ethereum.EventParam(
      "timestamp",
      ethereum.Value.fromUnsignedBigInt(timestamp)
    )
  )

  return commentAddedEvent
}

export function createPostCreatedEvent(
  author: Address,
  content: string,
  timestamp: BigInt
): PostCreated {
  let postCreatedEvent = changetype<PostCreated>(newMockEvent())

  postCreatedEvent.parameters = new Array()

  postCreatedEvent.parameters.push(
    new ethereum.EventParam("author", ethereum.Value.fromAddress(author))
  )
  postCreatedEvent.parameters.push(
    new ethereum.EventParam("content", ethereum.Value.fromString(content))
  )
  postCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "timestamp",
      ethereum.Value.fromUnsignedBigInt(timestamp)
    )
  )

  return postCreatedEvent
}

export function createPostLikedEvent(
  liker: Address,
  postId: BigInt
): PostLiked {
  let postLikedEvent = changetype<PostLiked>(newMockEvent())

  postLikedEvent.parameters = new Array()

  postLikedEvent.parameters.push(
    new ethereum.EventParam("liker", ethereum.Value.fromAddress(liker))
  )
  postLikedEvent.parameters.push(
    new ethereum.EventParam("postId", ethereum.Value.fromUnsignedBigInt(postId))
  )

  return postLikedEvent
}

export function createUserRegisteredEvent(
  userAddress: Address,
  username: string
): UserRegistered {
  let userRegisteredEvent = changetype<UserRegistered>(newMockEvent())

  userRegisteredEvent.parameters = new Array()

  userRegisteredEvent.parameters.push(
    new ethereum.EventParam(
      "userAddress",
      ethereum.Value.fromAddress(userAddress)
    )
  )
  userRegisteredEvent.parameters.push(
    new ethereum.EventParam("username", ethereum.Value.fromString(username))
  )

  return userRegisteredEvent
}
