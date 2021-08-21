const sw = {
	register: () => {
		window.addEventListener("load", () => {
			navigator.serviceWorker
				.register("/service-worker.js")
				.then((registration) => {
					registration.onupdatefound = () => {
						const installingWorker = registration.installing

						if (installingWorker == null) {
							return
						}

						installingWorker.onstatechange = () => {
							if (installingWorker.state === "installed") {
								if (navigator.serviceWorker.controller) {
									window.logger.log(
										"SW: new version available, " +
											"will be used when all tabs are closed"
									)
								} else {
									window.logger.log("SW: installed")
								}
							}
						}
					}
				})
				.catch((err: Error) => {
					window.logger.warn(`SW: installation failed: ${err}`)
				})
		})
	}
}

export default sw
