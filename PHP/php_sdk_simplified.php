<?php

class Meli {

  /**
   * @version 1.0.0
   */
    const VERSION  = "1.0.0";

    /**
     * @var $API_ROOT_URL is a main URL to access the Meli API's.
     * @var $AUTH_URL is a url to redirect the user for login.
     */
    protected static $API_ROOT_URL = "https://api.mercadolibre.com";
    protected static $OAUTH_URL    = "/oauth/token";

    protected static $AUTH_URL = array(
        "MLA" => "http://auth.mercadolibre.com.ar/authorization",
        "MLB" => "https://auth.mercadolivre.com.br/authorization",
        "MCO" => "https://auth.mercadolibre.com.co/authorization",
        "MCR" => "https://auth.mercadolibre.com.cr/authorization",
        "MEC" => "https://auth.mercadolibre.com.ec/authorization",
        "MLC" => "https://auth.mercadolibre.com.cl/authorization",
        "MLM" => "https://auth.mercadolibre.com.mx/authorization",
        "MLU" => "https://auth.mercadolibre.com.uy/authorization",
        "MLV" => "https://auth.mercadolibre.com.ve/authorization",
        "MPA" => "https://auth.mercadolibre.com.pa/authorization",
        "MPE" => "https://auth.mercadolibre.com.pe/authorization",
        "MPT" => "https://auth.mercadolivre.com.pt/authorization",
        "MRD" => "https://auth.mercadolibre.com.do/authorization" 
        );

    /**
     * Configuration for CURL
     */
    public static $CURL_OPTS = array(
        CURLOPT_USERAGENT => "MELI-PHP-SDK-2.0.1-BETA", 
        CURLOPT_SSL_VERIFYPEER => true,
        CURLOPT_CONNECTTIMEOUT => 10, 
        CURLOPT_RETURNTRANSFER => 1, 
        CURLOPT_TIMEOUT => 60
    );

    protected $client_id;
    protected $client_secret;
    protected $redirect_uri;
    protected $access_token;
    protected $refresh_token;
    protected $expires_in;

    /**
     * Constructor method. Set all variables to connect in Meli
     *
     * @param string $client_id
     * @param string $client_secret
     * @param string $site_id
     * @param string $access_token
     * @param string $refresh_token
     * @param integer $expires_in
     */
    public function __construct($client_id, $client_secret, $site_id, $access_token = null, $refresh_token = null, $expires_in = null) {
        $this->client_id = $client_id;
        $this->client_secret = $client_secret;
        $this->site_id = $site_id;
        $this->access_token = $access_token;
        $this->refresh_token = $refresh_token;
        $this->expires_in = $expires_in;
    }
    /**
     * 
     * NOTE:
     * 
     * @param string
     * @return string
     */
    public function automaticAuth($redirect_uri) {
        if($_GET['code'] || $this->access_token) {
            if($_GET['code'] && !($this->access_token)) {
                // If the code was in get parameter we authorize
                $user = $this->authorize($_GET['code'], $redirect_uri);
        
                // Now we create the sessions with the authenticated user
                $this->access_token = $user['body']->access_token;
                $this->expires_in = time() + $user['body']->expires_in;
                $this->refresh_token = $user['body']->refresh_token;
            } else {
                // We can check if the access token in invalid checking the time
                if($this->expires_in < time()) {
                    try {
                        // Make the refresh proccess
                        $refresh = $this->refreshAccessToken();
        
                        // Now we create the sessions with the new parameters
                        $this->access_token = $refresh['body']->access_token;
                        $this->expires_in = time() + $refresh['body']->expires_in;
                        $this->refresh_token = $refresh['body']->refresh_token;
                    } catch (Exception $e) {
                        echo "Exception: ",  $e->getMessage(), "\n";
                    }
                }
            }
        
            return array(
                'access_token' => $this->access_token, 
                'refresh_token' => $this->refresh_token, 
                'expires_in' => $this->expires_in
            );
        } else {
            header("Location: ".$this->getAuthUrl($redirect_uri));
        }
    } 


    /**
     * Return an string with a complete Meli login url.
     * NOTE: You can modify the $AUTH_URL to change the language of login
     * 
     * @param string $redirect_uri
     * @return string
     */
    public function getAuthUrl($redirect_uri) {
        $this->redirect_uri = $redirect_uri;
        $params = array("client_id" => $this->client_id, "response_type" => "code", "redirect_uri" => $redirect_uri);
        $auth_uri = self::$AUTH_URL[$this->site_id]."?".http_build_query($params);
        return $auth_uri;
    }

    /**
     * Executes a POST Request to authorize the application and take
     * an AccessToken.
     * 
     * @param string $code
     * @param string $redirect_uri
     * 
     */
    public function authorize($code, $redirect_uri) {
        if($redirect_uri)
            $this->redirect_uri = $redirect_uri;

        $body = array(
            "grant_type" => "authorization_code", 
            "client_id" => $this->client_id, 
            "client_secret" => $this->client_secret, 
            "code" => $code, 
            "redirect_uri" => $this->redirect_uri
        );

        $opts = array(
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => $body
        );
    
        $request = $this->execute(self::$OAUTH_URL, $opts);

        if($request["httpCode"] == 200) {             
            $this->access_token = $request["body"]->access_token;

            if($request["body"]->refresh_token)
                $this->refresh_token = $request["body"]->refresh_token;

            return $request;

        } else {
            return $request;
        }
    }

    /**
     * Execute a POST Request to create a new AccessToken from a existent refresh_token
     * 
     * @return string|mixed
     */
    public function refreshAccessToken() {
        if($this->refresh_token) {
             $body = array(
                "grant_type" => "refresh_token", 
                "client_id" => $this->client_id, 
                "client_secret" => $this->client_secret, 
                "refresh_token" => $this->refresh_token
            );

            $opts = array(
                CURLOPT_POST => true, 
                CURLOPT_POSTFIELDS => $body
            );
        
            $request = $this->execute(self::$OAUTH_URL, $opts);

            if($request["httpCode"] == 200) {             
                $this->access_token = $request["body"]->access_token;

                if($request["body"]->refresh_token)
                    $this->refresh_token = $request["body"]->refresh_token;

                return $request;

            } else {
                return $request;
            }   
        } else {
            $result = array(
                'error' => 'Offline-Access is not allowed.',
                'httpCode'  => null
            );
            return $result;
        }        
    }

    /**
     * Execute a GET Request
     * 
     * @param string $path
     * @param array $params
     * @return mixed
     */
    public function get($path, $params = null) {
        $exec = $this->execute($path, null, $params);

        return $exec;
    }

    /**
     * Execute a POST Request
     * 
     * @param string $body
     * @param array $params
     * @return mixed
     */
    public function post($path, $body = null, $params = array()) {
        $body = json_encode($body);
        $opts = array(
            CURLOPT_HTTPHEADER => array('Content-Type: application/json'),
            CURLOPT_POST => true, 
            CURLOPT_POSTFIELDS => $body
        );
        
        $exec = $this->execute($path, $opts, $params);

        return $exec;
    }

    /**
     * Execute a PUT Request
     * 
     * @param string $path
     * @param string $body
     * @param array $params
     * @return mixed
     */
    public function put($path, $body = null, $params) {
        $body = json_encode($body);
        $opts = array(
            CURLOPT_HTTPHEADER => array('Content-Type: application/json'),
            CURLOPT_CUSTOMREQUEST => "PUT",
            CURLOPT_POSTFIELDS => $body
        );
        
        $exec = $this->execute($path, $opts, $params);

        return $exec;
    }

    /**
     * Execute a DELETE Request
     * 
     * @param string $path
     * @param array $params
     * @return mixed
     */
    public function delete($path, $params) {
        $opts = array(
            CURLOPT_CUSTOMREQUEST => "DELETE"
        );
        
        $exec = $this->execute($path, $opts, $params);
        
        return $exec;
    }

    /**
     * Execute a OPTION Request
     * 
     * @param string $path
     * @param array $params
     * @return mixed
     */
    public function options($path, $params = null) {
        $opts = array(
            CURLOPT_CUSTOMREQUEST => "OPTIONS"
        );
        
        $exec = $this->execute($path, $opts, $params);

        return $exec;
    }

    /**
     * Execute all requests and returns the json body and headers
     * 
     * @param string $path
     * @param array $opts
     * @param array $params
     * @return mixed
     */
    public function execute($path, $opts = array(), $params = array()) {
        $uri = $this->make_path($path, $params);

        $ch = curl_init($uri);
        curl_setopt_array($ch, self::$CURL_OPTS);

        if(!empty($opts))
            curl_setopt_array($ch, $opts);

        $return["body"] = json_decode(curl_exec($ch));
        $return["httpCode"] = curl_getinfo($ch, CURLINFO_HTTP_CODE);

        curl_close($ch);
        
        return $return;
    }

    /**
     * Check and construct an real URL to make request
     * 
     * @param string $path
     * @param array $params
     * @return string
     */
    public function make_path($path, $params = array()) {
        if (!preg_match("/^http/", $path)) {
            if (!preg_match("/^\//", $path)) {
                $path = '/'.$path;
            }
            $uri = self::$API_ROOT_URL.$path;
        } else {
            $uri = $path;
        }

        if(!empty($params)) {
            $paramsJoined = array();

            foreach($params as $param => $value) {
               $paramsJoined[] = "$param=$value";
            }
            $params = '?'.implode('&', $paramsJoined);
            $uri = $uri.$params;
        }

        return $uri;
    }
}

?>