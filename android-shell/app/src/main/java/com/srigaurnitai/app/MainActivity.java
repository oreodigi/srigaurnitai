package com.srigaurnitai.app;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.graphics.Color;
import android.net.ConnectivityManager;
import android.net.Network;
import android.net.NetworkCapabilities;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.view.Gravity;
import android.view.View;
import android.view.WindowInsets;
import android.webkit.CookieManager;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceError;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.FrameLayout;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;

import java.io.File;

public class MainActivity extends Activity {
    private static final String BASE = "https://app.srigaurnitai.com";
    private static final int FILE_CHOOSER = 7001;
    private final int maroon = Color.rgb(114,11,50);
    private final int cream = Color.rgb(250,247,241);
    private final int ink = Color.rgb(35,27,31);
    private final int muted = Color.rgb(111,98,105);
    private FrameLayout root;
    private LinearLayout shell;
    private FrameLayout drawer;
    private View scrim;
    private WebView webView;
    private ValueCallback<Uri[]> filePathCallback;
    private String currentPath = "/";
    private boolean drawerOpen = false;
    private final String[][] primary = {{"⌂","Home","/"},{"★","Contests","/contests"},{"◈","Events","/events"},{"▦","Businesses","/businesses"},{"●","Account","/account"}};
    private final String[][] drawerItems = {{"⌂","Home","/"},{"★","Contests","/contests"},{"◈","Events","/events"},{"▦","Businesses","/businesses"},{"♛","Winners","/winners"},{"▤","Journal","/blog"},{"❝","Daily Quotes","/blog/category/daily-quotes"},{"▶","Public Videos","/videos"},{"?","Support","/support"},{"●","My Account","/account"}};

    @Override public void onCreate(Bundle state) {
        super.onCreate(state);
        getWindow().setStatusBarColor(maroon);
        getWindow().setNavigationBarColor(Color.WHITE);
        if (Build.VERSION.SDK_INT >= 30) getWindow().setDecorFitsSystemWindows(false);
        buildUi(); configureWebView();
        if (Build.VERSION.SDK_INT >= 30) root.setOnApplyWindowInsetsListener((v,insets)->{ android.graphics.Insets bars=insets.getInsets(WindowInsets.Type.systemBars()); shell.setPadding(0,bars.top,0,bars.bottom); drawer.setPadding(0,bars.top,0,bars.bottom); return WindowInsets.CONSUMED; });
        String start="/";
        if(getIntent()!=null&&getIntent().getData()!=null){ Uri d=getIntent().getData(); start=d.getPath()==null?"/":d.getPath(); if(d.getQuery()!=null) start+="?"+d.getQuery(); }
        loadSection(start);
    }
    private int dp(int v){return Math.round(v*getResources().getDisplayMetrics().density);}
    private TextView navButton(String icon,String label,String path,boolean bottom){ TextView t=new TextView(this); t.setGravity(Gravity.CENTER); t.setText(icon+"\n"+label); t.setTextColor(ink); t.setTextSize(bottom?11:15); t.setPadding(dp(8),dp(bottom?7:12),dp(8),dp(bottom?7:12)); t.setBackgroundColor(Color.TRANSPARENT); t.setOnClickListener(v->{closeDrawer();loadSection(path);}); if(bottom)t.setLayoutParams(new LinearLayout.LayoutParams(0,dp(66),1)); else t.setLayoutParams(new LinearLayout.LayoutParams(-1,dp(58))); return t; }
    private void buildUi(){
        root=new FrameLayout(this); root.setBackgroundColor(Color.WHITE);
        shell=new LinearLayout(this); shell.setOrientation(LinearLayout.VERTICAL); shell.setBackgroundColor(Color.WHITE);
        FrameLayout toolbar=new FrameLayout(this); toolbar.setBackgroundColor(cream); toolbar.setPadding(dp(8),0,dp(12),0); toolbar.setLayoutParams(new LinearLayout.LayoutParams(-1,dp(62)));
        TextView menu=new TextView(this); menu.setText("☰"); menu.setTextSize(27); menu.setTextColor(ink); menu.setGravity(Gravity.CENTER); menu.setContentDescription("Open menu"); toolbar.addView(menu,new FrameLayout.LayoutParams(dp(52),dp(62),Gravity.START|Gravity.CENTER_VERTICAL)); menu.setOnClickListener(v->openDrawer());
        ImageView mark=new ImageView(this); mark.setImageResource(R.drawable.sgn_mark); mark.setScaleType(ImageView.ScaleType.CENTER_INSIDE); mark.setContentDescription("Sri Gaur Nitai"); toolbar.addView(mark,new FrameLayout.LayoutParams(dp(54),dp(54),Gravity.END|Gravity.CENTER_VERTICAL));
        FrameLayout content=new FrameLayout(this); content.setBackgroundColor(Color.WHITE); content.setLayoutParams(new LinearLayout.LayoutParams(-1,0,1)); webView=new WebView(this); content.addView(webView,new FrameLayout.LayoutParams(-1,-1));
        LinearLayout bottom=new LinearLayout(this); bottom.setOrientation(LinearLayout.HORIZONTAL); bottom.setGravity(Gravity.CENTER); bottom.setBackgroundColor(Color.WHITE); bottom.setElevation(dp(10)); for(String[] i:primary)bottom.addView(navButton(i[0],i[1],i[2],true));
        shell.addView(toolbar); shell.addView(content); shell.addView(bottom); root.addView(shell,new FrameLayout.LayoutParams(-1,-1));
        scrim=new View(this); scrim.setBackgroundColor(0x66000000); scrim.setVisibility(View.GONE); scrim.setOnClickListener(v->closeDrawer()); root.addView(scrim,new FrameLayout.LayoutParams(-1,-1));
        drawer=new FrameLayout(this); drawer.setBackgroundColor(cream); drawer.setElevation(dp(20)); int w=Math.min(dp(320),(int)(getResources().getDisplayMetrics().widthPixels*.86f)); FrameLayout.LayoutParams dlp=new FrameLayout.LayoutParams(w,-1,Gravity.START); drawer.setLayoutParams(dlp); drawer.setTranslationX(-w);
        LinearLayout list=new LinearLayout(this); list.setOrientation(LinearLayout.VERTICAL); list.setPadding(dp(14),dp(14),dp(14),dp(14));
        ImageView big=new ImageView(this); big.setImageResource(R.drawable.sgn_mark); big.setScaleType(ImageView.ScaleType.CENTER_INSIDE); list.addView(big,new LinearLayout.LayoutParams(-1,dp(132)));
        TextView explore=new TextView(this); explore.setText("EXPLORE"); explore.setTextColor(muted); explore.setTextSize(11); explore.setPadding(dp(10),dp(8),dp(10),dp(4)); list.addView(explore); for(String[] i:drawerItems)list.addView(navButton(i[0],i[1],i[2],false)); drawer.addView(list,new FrameLayout.LayoutParams(-1,-1)); root.addView(drawer); setContentView(root);
    }
    private void configureWebView(){
        WebSettings s=webView.getSettings(); s.setJavaScriptEnabled(true); s.setDomStorageEnabled(true); s.setDatabaseEnabled(true); s.setAllowContentAccess(true); s.setAllowFileAccess(true); s.setMediaPlaybackRequiresUserGesture(false); s.setBuiltInZoomControls(false); s.setDisplayZoomControls(false); s.setSupportZoom(false); s.setCacheMode(WebSettings.LOAD_DEFAULT); s.setUserAgentString(s.getUserAgentString()+" SriGaurNitaiAndroid/2.0");
        CookieManager cm=CookieManager.getInstance(); cm.setAcceptCookie(true); cm.setAcceptThirdPartyCookies(webView,true);
        webView.setWebViewClient(new WebViewClient(){
            @Override public boolean shouldOverrideUrlLoading(WebView view,WebResourceRequest req){ Uri u=req.getUrl(); String host=u.getHost()==null?"":u.getHost(); if(("https".equals(u.getScheme())||"http".equals(u.getScheme()))&&(host.equals("app.srigaurnitai.com")||host.endsWith(".srigaurnitai.com")||host.endsWith("vercel.app"))){ String p=u.getPath()==null?"/":u.getPath(); if(u.getQuery()!=null)p+="?"+u.getQuery(); loadSection(p); return true;} try{startActivity(new Intent(Intent.ACTION_VIEW,u));}catch(Exception e){Toast.makeText(MainActivity.this,"Unable to open link",Toast.LENGTH_SHORT).show();} return true; }
            @Override public void onPageFinished(WebView view,String url){ injectAppChromeOverride(); if(isOnline()&&url.startsWith(BASE)){ File f=archiveFor(currentPath); webView.saveWebArchive(f.getAbsolutePath(),false,value->{});} }
            @Override public void onReceivedError(WebView view,WebResourceRequest request,WebResourceError error){ if(request.isForMainFrame()&&!isOnline())loadOffline(currentPath); }
        });
        webView.setWebChromeClient(new WebChromeClient(){ @Override public boolean onShowFileChooser(WebView w,ValueCallback<Uri[]> cb,FileChooserParams p){ if(filePathCallback!=null)filePathCallback.onReceiveValue(null); filePathCallback=cb; try{startActivityForResult(p.createIntent(),FILE_CHOOSER);return true;}catch(Exception e){filePathCallback=null;return false;} } });
    }
    private void injectAppChromeOverride(){ String js="(function(){var s=document.getElementById('sgn-native-shell-style');if(!s){s=document.createElement('style');s.id='sgn-native-shell-style';s.innerHTML='.topbar,.bottom-nav,.site-footer,.context-support{display:none!important} body{padding-bottom:0!important} main{min-height:auto!important}';document.head.appendChild(s);}})();"; webView.evaluateJavascript(js,null); }
    private File archiveFor(String path){ File dir=new File(getFilesDir(),"offline_pages"); if(!dir.exists())dir.mkdirs(); String key=path.replaceAll("[^a-zA-Z0-9]+","_"); if(key.length()==0)key="home"; return new File(dir,key+".mht"); }
    private void loadSection(String path){ if(path==null||path.length()==0)path="/"; currentPath=path; if(isOnline()){webView.getSettings().setCacheMode(WebSettings.LOAD_DEFAULT);webView.loadUrl(BASE+path);}else loadOffline(path); }
    private void loadOffline(String path){ File f=archiveFor(path); webView.getSettings().setCacheMode(WebSettings.LOAD_CACHE_ELSE_NETWORK); if(f.exists()){webView.loadUrl(Uri.fromFile(f).toString());Toast.makeText(this,"Offline • showing saved content",Toast.LENGTH_SHORT).show();}else{String html="<html><meta name='viewport' content='width=device-width,initial-scale=1'><body style='font-family:sans-serif;background:#faf7f1;color:#231b1f;padding:28px'><div style='max-width:560px;margin:50px auto;background:white;border-radius:20px;padding:24px;box-shadow:0 8px 30px #0001'><h2 style='color:#720b32'>You are offline</h2><p>This section has not been saved on this phone yet.</p><p>Open a section while connected once and Sri Gaur Nitai will keep an offline snapshot for later viewing.</p><p style='color:#6f6269;font-size:13px'>The bottom navigation and side menu remain available offline.</p></div></body></html>";webView.loadDataWithBaseURL(BASE,html,"text/html","UTF-8",null);} }
    private boolean isOnline(){ try{ConnectivityManager cm=(ConnectivityManager)getSystemService(Context.CONNECTIVITY_SERVICE); if(Build.VERSION.SDK_INT>=23){Network n=cm.getActiveNetwork();if(n==null)return false;NetworkCapabilities c=cm.getNetworkCapabilities(n);return c!=null&&(c.hasTransport(NetworkCapabilities.TRANSPORT_WIFI)||c.hasTransport(NetworkCapabilities.TRANSPORT_CELLULAR)||c.hasTransport(NetworkCapabilities.TRANSPORT_ETHERNET));}return cm.getActiveNetworkInfo()!=null&&cm.getActiveNetworkInfo().isConnected();}catch(Exception e){return true;} }
    private void openDrawer(){if(drawerOpen)return;drawerOpen=true;scrim.setVisibility(View.VISIBLE);drawer.animate().translationX(0).setDuration(180).start();}
    private void closeDrawer(){if(!drawerOpen)return;drawerOpen=false;drawer.animate().translationX(-drawer.getWidth()).setDuration(180).withEndAction(()->scrim.setVisibility(View.GONE)).start();}
    @Override protected void onActivityResult(int requestCode,int resultCode,Intent data){super.onActivityResult(requestCode,resultCode,data);if(requestCode==FILE_CHOOSER&&filePathCallback!=null){Uri[] out=null;if(resultCode==RESULT_OK&&data!=null){if(data.getClipData()!=null){int c=data.getClipData().getItemCount();out=new Uri[c];for(int i=0;i<c;i++)out[i]=data.getClipData().getItemAt(i).getUri();}else if(data.getData()!=null)out=new Uri[]{data.getData()};}filePathCallback.onReceiveValue(out);filePathCallback=null;}}
    @Override public void onBackPressed(){if(drawerOpen){closeDrawer();return;}if(webView!=null&&webView.canGoBack())webView.goBack();else super.onBackPressed();}
}
