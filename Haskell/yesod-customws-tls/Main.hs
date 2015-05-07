{-# LANGUAGE QuasiQuotes, TemplateHaskell, TypeFamilies, OverloadedStrings #-}
import Yesod.Core
import Yesod.WebSockets (sinkWSBinary, sourceWS, webSockets)
import Network.Wai.Handler.Warp (defaultSettings, setPort)
import Network.Wai.Handler.WarpTLS
import Control.Monad (forever)
import Conduit
import System.Posix.Env (getEnv)

data App = App

instance Yesod App

mkYesod "App" [parseRoutes|
/ HomeR GET
|]

getHomeR :: Handler Html
getHomeR = do
    webSockets $ forever $ sourceWS $$ sinkWSBinary
    defaultLayout $ [whamlet|<h1>Hello world!|]

main :: IO ()
main = getEnv "USE_SSL" >>= run

run :: Maybe String -> IO ()
run Nothing = warp 9000 App
run (Just _) = toWaiApp App >>= runTLS tls settings
  where
    settings = (setPort 9000 defaultSettings)
    tls      = defaultTlsSettings { certFile = "../../keys/server.crt"
                                  , keyFile  = "../../keys/server.key"
                                  }
