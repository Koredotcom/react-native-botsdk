//
//  AppTerminated.swift
//  RNKoreBotSDK
//
//  Created by Pagidimarri Kartheek on 08/09/25.
//

import Foundation
import React

@objc(AppTerminateModule)
class AppTerminateModule: RCTEventEmitter {

  private static var shared: AppTerminateModule?

  override init() {
    super.init()
    AppTerminateModule.shared = self
  }

  override class func requiresMainQueueSetup() -> Bool {
    return true
  }

  override func supportedEvents() -> [String]! {
    return ["AppTerminated"]
  }

  // 🔑 helper for AppDelegate
  @objc static func notifyAppTerminated() {
    shared?.sendEvent(withName: "AppTerminated", body: nil)
  }
}
