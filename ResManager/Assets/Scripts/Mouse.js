var rotatepos:Transform;//rotatepos是该物体的一个子物体，放到物体的中心地方就行。 
var horizontalSpeed : float ; 
var verticalSpeed : float ; 
var flag:boolean; 
 
var olddis:float=0; 
var newdis:float=0; 
var child:Transform; 
 
 
function Start(){ 
  horizontalSpeed=0; 
  verticalSpeed=0; 
  flag=true; 
} 
 
 
 
function Update () { 
	if(flag){ 
	  transform.RotateAround(rotatepos.position,Vector3.up,1); 
	} 
	
	if(Input.touchCount==1){ 
		if(Input.GetTouch(0).phase==TouchPhase.Moved){ 
   			flag=false; 
		    var h : float=Input.GetAxis("Mouse X");//又正左负 
		    var v : float =Input.GetAxis("Mouse Y");//上正下负 
		 	if(Mathf.Abs(h)>=Mathf.Abs(v)){  
			   if(h<0){ 
			     horizontalSpeed=6; 
			     transform.RotateAround(rotatepos.position,Vector3.up,horizontalSpeed); 
			   } 
			   if(h>0){ 
			     horizontalSpeed=6; 
			     transform.RotateAround(rotatepos.position,-Vector3.up,horizontalSpeed); 
			   } 
			} 
		  else{ 
			   if(v<0){ 
			     verticalSpeed=6; 
			     transform.RotateAround(rotatepos.position,-Vector3.right,verticalSpeed); 
			   } 
			   if(v>0){ 
			     verticalSpeed=6; 
			     transform.RotateAround(rotatepos.position,Vector3.right,verticalSpeed); 
			   } 
		  } 
		} 
	}
	  //物体的缩放 
	 if(Input.touchCount>1){ 
	 
	    flag=false; 
	   if(Input.GetTouch(0).phase==TouchPhase.Moved||Input.GetTouch(1).phase==TouchPhase.Moved){ 
	 
	    
	    var pos1=Input.GetTouch(0).position; 
	    var pos2=Input.GetTouch(1).position;    
	    newdis=Vector2.Distance(pos1,pos2); 
	    if(olddis!=null){  
	      if(newdis<olddis) {          
	        Camera.main.camera.orthographicSize+=2;    
	      } 
	      if(newdis>olddis) { 
	        Camera.main.camera.orthographicSize-=2;  
	      }      
	    } 
	    olddis=newdis;   
	 
	   }     
	 }
} 

