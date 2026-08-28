package com.srigaurnitai.app;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.net.*;
import android.os.Build;
import android.webkit.*;
import android.widget.TextView;
import android.widget.Toast;
import java.io.File;

public class WebEngine {
  public static final int FILE_CHOOSER=7001;
  private static final String BASE="https://app.srigaurnitai.com";
  private final Activity a; private final WebView main,pre; private final TextView sync; private final SharedPreferences prefs;
  private ValueCallback<Uri[]> fileCb; private String path="/"; private int pi=0;
  private final String[] preloads={"/","/contests","/events","/businesses","/winners","/blog","/blog/category/daily-quotes","/videos","/support","/account"};
  public WebEngine(Activity a,WebView main,WebView pre,TextView sync,SharedPreferences prefs){this.a=a;this.main=main;this.pre=pre;this.sync=sync;this.prefs=prefs;setupMain();setupPre();}
  private void settings(WebView w,String tag){WebSettings s=w.getSettings();s.setJavaScriptEnabled(true);s.setDomStorageEnabled(true);s.setDatabaseEnabled(true);s.setAllowContentAccess(true);s.setAllowFileAccess(true);s.setMediaPlaybackRequiresUserGesture(false);s.setBuiltInZoomControls(false);s.setDisplayZoomControls(false);s.setSupportZoom(false);s.setCacheMode(WebSettings.LOAD_DEFAULT);s.setUserAgentString(s.getUserAgentString()+" SriGaurNitaiAndroid/4.0 "+tag);CookieManager cm=CookieManager.getInstance();cm.setAcceptCookie(true);cm.setAcceptThirdPartyCookies(w,true);}
  private void setupMain(){settings(main,"main");main.setWebViewClient(new WebViewClient(){
    @Override public boolean shouldOverrideUrlLoading(WebView v,WebResourceRequest r){Uri u=r.getUrl();String h=u.getHost()==null?"":u.getHost();if(("https".equals(u.getScheme())||"http".equals(u.getScheme()))&&(h.equals("app.srigaurnitai.com")||h.endsWith(".srigaurnitai.com")||h.endsWith("vercel.app"))){String p=u.getPath()==null?"/":u.getPath();if(u.getQuery()!=null)p+="?"+u.getQuery();load(p);return true;}try{a.startActivity(new Intent(Intent.ACTION_VIEW,u));}catch(Exception e){Toast.makeText(a,"Unable to open link",Toast.LENGTH_SHORT).show();}return true;}
    @Override public void onPageFinished(WebView v,String url){hideWebChrome(v);if(online()&&url.startsWith(BASE))v.saveWebArchive(archive(path).getAbsolutePath(),false,x->{});}
    @Override public void onReceivedError(WebView v,WebResourceRequest r,WebResourceError e){if(r.isForMainFrame()&&!online())offline(path);}
  });main.setWebChromeClient(new WebChromeClient(){@Override public boolean onShowFileChooser(WebView w,ValueCallback<Uri[]> cb,FileChooserParams p){if(fileCb!=null)fileCb.onReceiveValue(null);fileCb=cb;try{a.startActivityForResult(p.createIntent(),FILE_CHOOSER);return true;}catch(Exception e){fileCb=null;return false;}}});}
  private void setupPre(){settings(pre,"preload");pre.setWebViewClient(new WebViewClient(){@Override public void onPageFinished(WebView v,String url){hideWebChrome(v);if(pi<preloads.length){String p=preloads[pi];v.saveWebArchive(archive(p).getAbsolutePath(),false,x->{pi++;syncText();pre.postDelayed(()->nextPre(),120);});}}});}
  private void hideWebChrome(WebView v){v.evaluateJavascript("(function(){var s=document.getElementById('sgn-native');if(!s){s=document.createElement('style');s.id='sgn-native';s.innerHTML='.topbar,.bottom-nav,.site-footer,.context-support{display:none!important}body{padding-bottom:0!important}';document.head.appendChild(s)}})()",null);}
  public void load(String p){if(p==null||p.isEmpty())p="/";path=p;if(online()){main.getSettings().setCacheMode(WebSettings.LOAD_DEFAULT);main.loadUrl(BASE+p);}else offline(p);}
  private void offline(String p){File f=archive(p);main.getSettings().setCacheMode(WebSettings.LOAD_CACHE_ELSE_NETWORK);if(f.exists()){main.loadUrl(Uri.fromFile(f).toString());Toast.makeText(a,"Offline • saved content",Toast.LENGTH_SHORT).show();}else{String html="<html><meta name='viewport' content='width=device-width,initial-scale=1'><body style='font-family:sans-serif;background:#fcf8f0;padding:28px;color:#2d2226'><div style='margin:45px auto;max-width:520px;background:#fff;border:1px solid #eddcbe;border-radius:24px;padding:26px'><h2 style='color:#700831'>Offline</h2><p>This section has not been saved yet.</p><p>Connect once and the app will automatically prepare the main sections for offline viewing.</p></div></body></html>";main.loadDataWithBaseURL(BASE,html,"text/html","UTF-8",null);}}
  private File archive(String p){File d=new File(a.getFilesDir(),"offline_pages");if(!d.exists())d.mkdirs();String k=p.replaceAll("[^a-zA-Z0-9]+","_");if(k.isEmpty())k="home";return new File(d,k+".mht");}
  public void startPreload(){if(prefs.getBoolean("preload_complete_v4",false)){sync.setText("Offline library ready");return;}if(!online()){sync.setText("Connect once to prepare offline content");return;}pi=0;syncText();nextPre();}
  private void nextPre(){if(pi>=preloads.length){prefs.edit().putBoolean("preload_complete_v4",true).apply();sync.setText("Offline library ready • 10 sections");pre.loadUrl("about:blank");return;}pre.loadUrl(BASE+preloads[pi]);}
  private void syncText(){sync.setText("Preparing offline library • "+pi+"/"+preloads.length);}
  private boolean online(){try{ConnectivityManager cm=(ConnectivityManager)a.getSystemService(Context.CONNECTIVITY_SERVICE);if(Build.VERSION.SDK_INT>=23){Network n=cm.getActiveNetwork();if(n==null)return false;NetworkCapabilities c=cm.getNetworkCapabilities(n);return c!=null&&(c.hasTransport(NetworkCapabilities.TRANSPORT_WIFI)||c.hasTransport(NetworkCapabilities.TRANSPORT_CELLULAR)||c.hasTransport(NetworkCapabilities.TRANSPORT_ETHERNET));}return cm.getActiveNetworkInfo()!=null&&cm.getActiveNetworkInfo().isConnected();}catch(Exception e){return true;}}
  public boolean canBack(){return main.canGoBack();} public void back(){main.goBack();}
  public void activityResult(int req,int result,Intent data){if(req!=FILE_CHOOSER||fileCb==null)return;Uri[] out=null;if(result==Activity.RESULT_OK&&data!=null){if(data.getClipData()!=null){int c=data.getClipData().getItemCount();out=new Uri[c];for(int i=0;i<c;i++)out[i]=data.getClipData().getItemAt(i).getUri();}else if(data.getData()!=null)out=new Uri[]{data.getData()};}fileCb.onReceiveValue(out);fileCb=null;}
}
