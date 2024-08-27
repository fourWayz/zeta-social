import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Address, BigInt } from "@graphprotocol/graph-ts"
import { CommentAdded } from "../generated/schema"
import { CommentAdded as CommentAddedEvent } from "../generated/SocialMedia/SocialMedia"
import { handleCommentAdded } from "../src/social-media"
import { createCommentAddedEvent } from "./social-media-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let commenter = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let postId = BigInt.fromI32(234)
    let content = "Example string value"
    let timestamp = BigInt.fromI32(234)
    let newCommentAddedEvent = createCommentAddedEvent(
      commenter,
      postId,
      content,
      timestamp
    )
    handleCommentAdded(newCommentAddedEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("CommentAdded created and stored", () => {
    assert.entityCount("CommentAdded", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "CommentAdded",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "commenter",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "CommentAdded",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "postId",
      "234"
    )
    assert.fieldEquals(
      "CommentAdded",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "content",
      "Example string value"
    )
    assert.fieldEquals(
      "CommentAdded",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "timestamp",
      "234"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
